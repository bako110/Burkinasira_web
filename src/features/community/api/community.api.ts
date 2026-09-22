import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  Post,
  CreatePostPayload,
  Comment,
  CreateCommentPayload,
  FavoriteList,
  CreateFavoriteListPayload,
  Group,
  GroupDetail,
  CreateGroupPayload,
  UpdateGroupPayload,
  Question,
  CreateQuestionPayload,
  QuestionStatus,
  Answer,
  CreateAnswerPayload,
  ReportContentPayload,
  LiveSession,
  StartLivePayload,
  LiveToken,
} from '../types';

export async function fetchPosts(
  params: { author_id?: string; group_id?: string; page?: number; page_size?: number } = {},
): Promise<PaginatedResponse<Post>> {
  const { data } = await apiClient.get<PaginatedResponse<Post>>('/community/posts', { params });
  return data;
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const { data } = await apiClient.post<Post>('/community/posts', payload);
  return data;
}

export async function likePost(postId: string): Promise<Post> {
  const { data } = await apiClient.post<Post>(`/community/posts/${postId}/like`);
  return data;
}

export async function deletePost(postId: string): Promise<void> {
  await apiClient.delete(`/community/posts/${postId}`);
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data } = await apiClient.get<Comment[]>(`/community/posts/${postId}/comments`);
  return data;
}

export async function addComment(postId: string, payload: CreateCommentPayload): Promise<Comment> {
  const { data } = await apiClient.post<Comment>(`/community/posts/${postId}/comments`, payload);
  return data;
}

export async function fetchMyFavoriteLists(): Promise<FavoriteList[]> {
  const { data } = await apiClient.get<FavoriteList[]>('/community/favorite-lists');
  return data;
}

export async function createFavoriteList(payload: CreateFavoriteListPayload): Promise<FavoriteList> {
  const { data } = await apiClient.post<FavoriteList>('/community/favorite-lists', payload);
  return data;
}

export async function addToFavoriteList(listId: string, destinationId: string): Promise<FavoriteList> {
  const { data } = await apiClient.post<FavoriteList>(`/community/favorite-lists/${listId}/items`, {
    destination_id: destinationId,
  });
  return data;
}

export async function removeFromFavoriteList(listId: string, destinationId: string): Promise<FavoriteList> {
  const { data } = await apiClient.delete<FavoriteList>(
    `/community/favorite-lists/${listId}/items/${destinationId}`,
  );
  return data;
}

export async function deleteFavoriteList(listId: string): Promise<void> {
  await apiClient.delete(`/community/favorite-lists/${listId}`);
}

export async function fetchGroups(
  publicOnly = true,
  region?: string,
  theme?: string,
  province?: string,
): Promise<Group[]> {
  const { data } = await apiClient.get<Group[]>('/community/groups', {
    params: { public_only: publicOnly, region, theme, province },
  });
  return data;
}

export async function createGroup(payload: CreateGroupPayload): Promise<Group> {
  const { data } = await apiClient.post<Group>('/community/groups', payload);
  return data;
}

export async function fetchGroupDetail(groupId: string): Promise<GroupDetail> {
  const { data } = await apiClient.get<GroupDetail>(`/community/groups/${groupId}`);
  return data;
}

export async function updateGroup(groupId: string, payload: UpdateGroupPayload): Promise<Group> {
  const { data } = await apiClient.patch<Group>(`/community/groups/${groupId}`, payload);
  return data;
}

export async function joinGroup(groupId: string): Promise<Group> {
  const { data } = await apiClient.post<Group>(`/community/groups/${groupId}/join`);
  return data;
}

export async function leaveGroup(groupId: string): Promise<Group> {
  const { data } = await apiClient.post<Group>(`/community/groups/${groupId}/leave`);
  return data;
}

export async function fetchQuestions(statusFilter?: QuestionStatus): Promise<Question[]> {
  const { data } = await apiClient.get<Question[]>('/community/questions', {
    params: statusFilter ? { status_filter: statusFilter } : undefined,
  });
  return data;
}

export async function createQuestion(payload: CreateQuestionPayload): Promise<Question> {
  const { data } = await apiClient.post<Question>('/community/questions', payload);
  return data;
}

export async function fetchAnswers(questionId: string): Promise<Answer[]> {
  const { data } = await apiClient.get<Answer[]>(`/community/questions/${questionId}/answers`);
  return data;
}

export async function answerQuestion(questionId: string, payload: CreateAnswerPayload): Promise<Answer> {
  const { data } = await apiClient.post<Answer>(`/community/questions/${questionId}/answers`, payload);
  return data;
}

export async function reportContent(payload: ReportContentPayload): Promise<void> {
  await apiClient.post('/community/reports', payload);
}

export async function fetchLiveSessions(groupId?: string): Promise<LiveSession[]> {
  const { data } = await apiClient.get<LiveSession[]>('/community/live', {
    params: groupId ? { group_id: groupId } : undefined,
  });
  return data;
}

export async function startLive(payload: StartLivePayload): Promise<LiveSession> {
  const { data } = await apiClient.post<LiveSession>('/community/live', payload);
  return data;
}

export async function fetchLiveSession(sessionId: string): Promise<LiveSession> {
  const { data } = await apiClient.get<LiveSession>(`/community/live/${sessionId}`);
  return data;
}

export async function endLive(sessionId: string): Promise<LiveSession> {
  const { data } = await apiClient.post<LiveSession>(`/community/live/${sessionId}/end`);
  return data;
}

export async function fetchLiveToken(sessionId: string): Promise<LiveToken> {
  const { data } = await apiClient.post<LiveToken>(`/community/live/${sessionId}/token`);
  return data;
}
