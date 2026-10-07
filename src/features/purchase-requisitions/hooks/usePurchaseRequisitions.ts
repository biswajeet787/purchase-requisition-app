import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNextPRNumber, getPR, listPRs, savePR, transitionPR } from '../api/prApi';
import type { PRListParams } from '../types';

export const prKeys = {
  all: ['purchase-requisitions'] as const,
  list: (params: PRListParams) => [...prKeys.all, 'list', params] as const,
  detail: (id: string) => [...prKeys.all, 'detail', id] as const,
  nextNumber: () => [...prKeys.all, 'next-number'] as const,
};

export const usePRList = (params: PRListParams) =>
  useQuery({
    queryKey: prKeys.list(params),
    queryFn: () => listPRs(params),
    placeholderData: keepPreviousData,
  });

export const usePR = (id: string | undefined) =>
  useQuery({
    queryKey: prKeys.detail(id ?? ''),
    queryFn: () => getPR(id as string),
    enabled: Boolean(id),
    retry: (count, error) => (error as { status?: number }).status !== 404 && count < 1,
  });

export const useNextPRNumber = (enabled: boolean) =>
  useQuery({ queryKey: prKeys.nextNumber(), queryFn: getNextPRNumber, enabled, staleTime: 0 });

export const useSavePR = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: savePR,
    onSuccess: () => qc.invalidateQueries({ queryKey: prKeys.all }),
  });
};

export const useTransitionPR = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transitionPR,
    onSuccess: () => qc.invalidateQueries({ queryKey: prKeys.all }),
  });
};
