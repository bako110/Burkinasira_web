import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchQuestions, createQuestion, fetchAnswers, answerQuestion } from '../api/community.api';
import type { CreateAnswerPayload, QuestionStatus } from '../types';

export function useQuestions(statusFilter?: QuestionStatus) {
  return useQuery({
    queryKey: ['community-questions', statusFilter],
    queryFn: () => fetchQuestions(statusFilter),
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-questions'] }),
  });
}

export function useAnswers(questionId: string | undefined) {
  return useQuery({
    queryKey: ['question-answers', questionId],
    queryFn: () => fetchAnswers(questionId as string),
    enabled: Boolean(questionId),
  });
}

export function useAnswerQuestion(questionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAnswerPayload) => answerQuestion(questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-answers', questionId] });
      queryClient.invalidateQueries({ queryKey: ['community-questions'] });
    },
  });
}
