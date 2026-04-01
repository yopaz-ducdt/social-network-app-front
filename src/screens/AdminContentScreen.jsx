import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { adminService } from '@/services/adminService';

const getReportPostId = (report) =>
  report?.postId ??
  report?.postResponse?.id ??
  report?.post?.id ??
  report?.postResponse?.postId ??
  report?.post?.postId ??
  '';

const pickFirstText = (...values) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
};

const getReportReason = (report) =>
  pickFirstText(report?.reason, report?.content, report?.title) || 'Không có lý do';

const getTimestamp = (value) => {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const isApiErrorPayload = (value) =>
  Boolean(
    value && typeof value === 'object' && 'code' in value && 'message' in value && !('id' in value)
  );

const ModerationCard = ({ item, onIgnore, onDelete, onView }) => (
  <View className="mx-4 mb-4 overflow-hidden rounded-xl border border-gray-200">
    <View className="flex-row items-center justify-between border-b border-gray-100 px-3 py-2.5">
      <View className="flex-row items-center">
        <Text style={{ fontSize: 14, marginRight: 6 }}>
          {item.warning ? '⚠️' : item.reportCount > 0 ? '📄' : '📝'}
        </Text>
        <Text className="text-xs font-bold text-gray-700">POST ID: {item.postId || 'N/A'}</Text>
      </View>
      <Text className="text-xs text-gray-400">
        {item.warning && item.reportCount > 0
          ? 'Cảnh báo + tố cáo'
          : item.warning
            ? 'Bị cảnh báo'
            : `${item.reportCount} báo cáo`}
      </Text>
    </View>

    <TouchableOpacity className="px-3 pb-2 pt-3" activeOpacity={0.8} onPress={() => onView(item)}>
      <Text className="mb-1 text-sm font-semibold text-gray-900">{item.title}</Text>
      {item.caption ? <Text className="mb-2 text-sm text-gray-700">{item.caption}</Text> : null}

      <View className="mb-2 flex-row flex-wrap gap-2">
        {item.warning ? (
          <View className="rounded-full bg-amber-100 px-2.5 py-1">
            <Text className="text-xs font-semibold text-amber-800">BỊ CẢNH BÁO</Text>
          </View>
        ) : null}
        {item.reportCount > 0 ? (
          <View className="rounded-full bg-gray-100 px-2.5 py-1">
            <Text className="text-xs font-semibold text-gray-700">{item.reportCount} BÁO CÁO</Text>
          </View>
        ) : null}
      </View>

      {item.warningReason ? (
        <Text className="mb-2 text-sm text-gray-700">Cảnh báo: {item.warningReason}</Text>
      ) : null}
      {item.reasonSummary ? (
        <Text className="mb-2 text-sm text-gray-700">Tố cáo: {item.reasonSummary}</Text>
      ) : null}
      {item.reportTitles?.length ? (
        <Text className="text-xs uppercase tracking-wide text-gray-500">
          Loại báo cáo: {item.reportTitles.join(' • ')}
        </Text>
      ) : null}

      {item.hasImage && (
        <View className="mt-3 h-28 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
          <Text style={{ fontSize: 28, color: '#d1d5db' }}>🖼️</Text>
        </View>
      )}
    </TouchableOpacity>

    <View className="flex-row gap-2 px-3 pb-3">
      <TouchableOpacity
        onPress={() => onView(item)}
        activeOpacity={0.8}
        className="flex-1 items-center rounded-lg border border-gray-300 py-3">
        <Text className="text-sm font-semibold text-gray-700">XEM BÀI</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onIgnore(item)}
        activeOpacity={0.8}
        className="flex-1 items-center rounded-lg border border-gray-300 py-3">
        <Text className="text-sm font-semibold text-gray-700">BỎ QUA</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(item.postId)}
        activeOpacity={0.8}
        className="flex-1 flex-row items-center justify-center gap-1 rounded-lg bg-gray-900 py-3">
        <Text style={{ fontSize: 14 }}>🗑️</Text>
        <Text className="ml-1 text-sm font-bold text-white">XOÁ BÀI</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function AdminContentScreen() {
  const navigation = useNavigation();
  const [warningPosts, setWarningPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeWarningPosts = useCallback((payload) => {
    const items = payload?.content ?? payload?.items ?? payload ?? [];
    if (!Array.isArray(items)) return [];
    return items.map((post) => ({
      id: String(post?.id ?? ''),
      postId: String(post?.id ?? ''),
      reason: 'BÀI VIẾT BỊ CẢNH BÁO',
      reasonIcon: '⚠️',
      warningStatus: post?.warning ? 'CẢNH BÁO' : 'BÌNH THƯỜNG',
      title: post?.title ?? '',
      caption: post?.content ?? '',
      hasImage: Array.isArray(post?.images) && post.images.length > 0,
      highlighted: Boolean(post?.warning),
      warning: Boolean(post?.warning),
      warningReason: post?.warning ? 'Bài viết bị hệ thống cảnh báo' : '',
      raw: post,
    }));
  }, []);

  const normalizeReports = useCallback((payload, postLookup = {}) => {
    const items = payload?.content ?? payload?.items ?? payload ?? [];
    if (!Array.isArray(items)) return [];

    const grouped = new Map();

    items.forEach((report, index) => {
      const postId = String(getReportPostId(report) ?? '').trim();
      const groupId = postId || `report-${report?.id ?? index}`;
      const reason = getReportReason(report);
      const createdAt = report?.createdAt ?? '';
      const reportTitle = pickFirstText(report?.title);
      const relatedPost = isApiErrorPayload(postLookup[postId]) ? null : postLookup[postId];

      if (!grouped.has(groupId)) {
        grouped.set(groupId, {
          id: groupId,
          postId,
          title: relatedPost?.title ?? '',
          caption: relatedPost?.content ?? '',
          hasImage: Array.isArray(relatedPost?.images) && relatedPost.images.length > 0,
          time: createdAt,
          reportCount: 0,
          reasons: [],
          reportTitles: [],
          rawReports: [],
          rawPost: relatedPost ?? null,
        });
      }

      const current = grouped.get(groupId);
      current.reportCount += 1;
      current.rawReports.push(report);

      if (!current.title && relatedPost?.title) {
        current.title = relatedPost.title;
      }

      if (!current.caption && relatedPost?.content) {
        current.caption = relatedPost.content;
      }

      if (
        !current.hasImage &&
        Array.isArray(relatedPost?.images) &&
        relatedPost.images.length > 0
      ) {
        current.hasImage = true;
      }

      if (!current.rawPost && relatedPost) {
        current.rawPost = relatedPost;
      }

      if (reason && !current.reasons.includes(reason)) {
        current.reasons.push(reason);
      }

      if (reportTitle && !current.reportTitles.includes(reportTitle)) {
        current.reportTitles.push(reportTitle);
      }

      if (getTimestamp(createdAt) > getTimestamp(current.time)) {
        current.time = createdAt;
      }
    });

    return Array.from(grouped.values())
      .map((report) => ({
        ...report,
        title: report.title || `Bài viết #${report.postId || 'không xác định'}`,
        reasonSummary: report.reasons.join(' • ') || 'Không có lý do',
      }))
      .sort((a, b) => getTimestamp(b.time) - getTimestamp(a.time));
  }, []);

  const moderationItems = useMemo(() => {
    const grouped = new Map();

    warningPosts.forEach((post) => {
      grouped.set(post.postId, {
        id: post.id,
        postId: post.postId,
        title: post.title || `Bài viết #${post.postId || 'không xác định'}`,
        caption: post.caption,
        hasImage: post.hasImage,
        warning: post.warning,
        warningReason: post.warningReason,
        reportCount: 0,
        reasonSummary: '',
        reportTitles: [],
        rawPost: post.raw ?? post,
        rawReports: [],
      });
    });

    reports.forEach((report) => {
      const key = report.postId || report.id;
      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          postId: report.postId,
          title: report.title || `Bài viết #${report.postId || 'không xác định'}`,
          caption: report.caption ?? '',
          hasImage: Boolean(report.hasImage),
          warning: false,
          warningReason: '',
          reportCount: 0,
          reasonSummary: '',
          reportTitles: [],
          rawPost: report.rawPost ?? null,
          rawReports: report.rawReports ?? [],
        });
      }

      const current = grouped.get(key);
      current.postId = current.postId || report.postId;
      if ((!current.title || current.title.startsWith('Bài viết #')) && report.title) {
        current.title = report.title;
      }
      if (!current.caption && report.caption) {
        current.caption = report.caption;
      }
      if (!current.hasImage && report.hasImage) {
        current.hasImage = report.hasImage;
      }
      current.reportCount = report.reportCount;
      current.reasonSummary = report.reasonSummary;
      current.reportTitles = report.reportTitles ?? [];
      if (!current.rawPost && report.rawPost) {
        current.rawPost = report.rawPost;
      }
      current.rawReports = report.rawReports ?? current.rawReports ?? [];
    });

    return Array.from(grouped.values()).sort((a, b) => {
      if (a.warning !== b.warning) return a.warning ? -1 : 1;
      if (a.reportCount !== b.reportCount) return b.reportCount - a.reportCount;
      return String(a.postId).localeCompare(String(b.postId));
    });
  }, [reports, warningPosts]);

  const loadWarningPosts = useCallback(async () => {
    const payload = await adminService.getWarningPosts(0, 50);
    setWarningPosts(normalizeWarningPosts(payload));
  }, [normalizeWarningPosts]);

  const loadReports = useCallback(async () => {
    const payload = await adminService.getAllReports(0, 50);
    const items = payload?.content ?? payload?.items ?? payload ?? [];
    const postIds = Array.from(
      new Set(
        (Array.isArray(items) ? items : [])
          .map((report) => String(getReportPostId(report) ?? '').trim())
          .filter(Boolean)
      )
    );
    const postEntries = await Promise.all(
      postIds.map(async (postId) => {
        try {
          const post = await adminService.getPost(postId);
          if (isApiErrorPayload(post)) {
            return [postId, null];
          }
          return [postId, post];
        } catch {
          return [postId, null];
        }
      })
    );
    setReports(normalizeReports(payload, Object.fromEntries(postEntries)));
  }, [normalizeReports]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        await Promise.all([loadWarningPosts(), loadReports()]);
      } catch {
        if (mounted) {
          setWarningPosts([]);
          setReports([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadReports, loadWarningPosts]);

  const handleIgnore = async (item) => {
    const postId = item?.postId;
    const reportIds = (Array.isArray(item?.rawReports) ? item.rawReports : [])
      .map((report) => report?.id)
      .filter(Boolean);

    if (reportIds.length === 0) {
      setWarningPosts((prev) => prev.filter((post) => post.postId !== postId));
      setReports((prev) => prev.filter((report) => report.postId !== postId));
      return;
    }

    try {
      await Promise.all(reportIds.map((reportId) => adminService.deleteReport(reportId)));
      await Promise.all([loadWarningPosts(), loadReports()]);
    } catch (e) {
      Alert.alert('Thất bại', e.message);
    }
  };

  const openPostDetail = async (postId, fallbackPost = null) => {
    if (!postId) {
      Alert.alert('Không thể xem bài viết', 'Không tìm thấy postId trong dữ liệu.');
      return;
    }

    try {
      const rawPost = await adminService.getPost(postId);
      if (isApiErrorPayload(rawPost)) {
        throw new Error(rawPost.message || 'Post not found');
      }
      navigation.navigate('PostDetail', {
        postId,
        post: rawPost ?? fallbackPost,
        adminView: true,
      });
    } catch (e) {
      const safeFallbackPost = isApiErrorPayload(fallbackPost) ? null : fallbackPost;
      if (safeFallbackPost) {
        navigation.navigate('PostDetail', {
          postId,
          post: safeFallbackPost,
          adminView: true,
        });
        return;
      }

      Alert.alert('Không thể xem bài viết', e.message);
    }
  };

  const handleViewPost = (item) => {
    openPostDetail(item?.postId, item?.rawPost ?? null);
  };

  const handleDelete = async (postId) => {
    try {
      await adminService.deletePost(postId);
      await Promise.all([loadWarningPosts(), loadReports()]);
    } catch (e) {
      Alert.alert('Thất bại', e.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2 p-1">
          <Text style={{ fontSize: 28, lineHeight: 30, color: '#111' }}>‹</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-base font-bold text-gray-900">
          Danh sách kiểm duyệt
        </Text>
        <View className="w-8" />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#000" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}>
          {moderationItems.length > 0 ? (
            <FlatList
              data={moderationItems}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <ModerationCard
                  item={item}
                  onIgnore={handleIgnore}
                  onDelete={handleDelete}
                  onView={handleViewPost}
                />
              )}
            />
          ) : (
            <View className="items-center px-6 py-10">
              <Text className="text-sm text-gray-400">Không có bài viết nào cần kiểm duyệt</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
