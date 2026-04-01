import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PostOptionsModal({ visible, onClose, post, isMyPost, onDelete, onReport }) {
  const navigation = useNavigation();
  const [deleting, setDeleting] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportContent, setReportContent] = useState('');

  const handleEdit = () => {
    if (deleting || reporting) return;
    if (!isMyPost) {
      Alert.alert('Thông báo', 'Chỉ chủ bài viết mới có thể chỉnh sửa bài viết này.');
      return;
    }
    onClose();
    navigation.navigate('EditPost', { post });
  };

  const confirmDelete = () => {
    if (deleting || reporting) return;
    if (!isMyPost) {
      Alert.alert('Thông báo', 'Chỉ chủ bài viết mới có thể xóa bài viết này.');
      return;
    }

    Alert.alert('Xóa bài viết', 'Bạn có chắc muốn xóa bài viết này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await onDelete?.(post?.id);
            onClose();
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  const resetReportState = () => {
    setShowReportForm(false);
    setReportContent('');
    setReporting(false);
  };

  const handleClose = () => {
    if (deleting || reporting) return;
    resetReportState();
    onClose();
  };

  const submitReport = async () => {
    const content = reportContent.trim();
    if (!content) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung báo cáo.');
      return;
    }

    try {
      setReporting(true);
      await onReport?.(content);
      resetReportState();
      onClose();
      Alert.alert('Thành công', 'Đã gửi báo cáo.');
    } catch (e) {
      Alert.alert('Thất bại', e?.message ?? 'Không thể gửi báo cáo.');
    } finally {
      setReporting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black/40" />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <View className="rounded-t-2xl bg-white px-4 pb-10 pt-3">
        {/* Handle bar */}
        <View className="mb-5 h-1 w-10 self-center rounded-full bg-gray-300" />

        {showReportForm ? (
          <>
            <Text className="mb-3 text-base font-semibold text-gray-900">Báo cáo bài viết</Text>
            <TextInput
              className="min-h-28 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900"
              placeholder="Nhập nội dung báo cáo..."
              placeholderTextColor="#9ca3af"
              value={reportContent}
              onChangeText={setReportContent}
              multiline
              textAlignVertical="top"
              editable={!reporting}
            />
            <View className="mt-4 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 items-center rounded-xl border border-gray-200 py-3"
                activeOpacity={0.8}
                disabled={reporting}
                onPress={resetReportState}>
                <Text className="text-sm font-semibold text-gray-700">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 items-center rounded-xl bg-red-500 py-3"
                activeOpacity={0.8}
                disabled={reporting}
                onPress={submitReport}>
                {reporting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-sm font-semibold text-white">Gửi báo cáo</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleEdit}
              disabled={deleting || reporting}
              activeOpacity={0.7}
              className="flex-row items-center border-b border-gray-100 py-4">
              <Text style={{ fontSize: 20, width: 32 }}>✏️</Text>
              <Text className="text-base text-gray-900">Chỉnh sửa bài viết</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={confirmDelete}
              disabled={deleting || reporting}
              activeOpacity={0.7}
              className="flex-row items-center border-b border-gray-100 py-4">
              {deleting ? (
                <ActivityIndicator size="small" color="#ef4444" style={{ width: 32 }} />
              ) : (
                <Text style={{ fontSize: 20, width: 32 }}>🗑️</Text>
              )}
              <Text className="text-base text-red-500">
                {deleting ? 'Đang xoá...' : 'Xoá bài viết'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowReportForm(true)}
              disabled={deleting || reporting}
              activeOpacity={0.7}
              className="flex-row items-center py-4">
              <Text style={{ fontSize: 20, width: 32 }}>🚩</Text>
              <Text className="text-base text-red-500">Báo cáo bài viết</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
}
