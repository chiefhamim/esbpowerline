import { toast, type ExternalToast } from 'sonner';

export type ArticleSaveIntent = 'save' | 'publish' | 'schedule' | 'unpublish' | 'create';

export function resolveArticleSaveIntent(
  publishStatus: string | undefined,
  currentStatus: string,
): ArticleSaveIntent {
  if (!publishStatus) return 'save';
  if (publishStatus === 'PUBLISHED') return 'publish';
  if (publishStatus === 'SCHEDULED') return 'schedule';
  if (publishStatus === 'DRAFT' && currentStatus === 'PUBLISHED') return 'unpublish';
  return 'save';
}

export function getArticleSaveToast(
  intent: ArticleSaveIntent,
  mode: 'create' | 'edit',
  status: string,
  previousStatus?: string,
): { title: string; description?: string } {
  switch (intent) {
    case 'create':
      return {
        title: 'Draft created',
        description: 'Your new story is saved in the editorial workspace.',
      };
    case 'save':
      if (mode === 'create') {
        return {
          title: 'Draft saved',
          description: 'Continue editing when you are ready.',
        };
      }
      if (status === 'PUBLISHED') {
        return {
          title: 'Changes saved',
          description: 'Your edits are live on the site.',
        };
      }
      if (status === 'SCHEDULED') {
        return {
          title: 'Scheduled article updated',
          description: 'Content and publish time were saved.',
        };
      }
      if (status === 'IN_REVIEW') {
        return {
          title: 'Updates saved',
          description: 'The article remains in admin review.',
        };
      }
      return {
        title: 'Draft saved',
        description: 'Your work is stored in the editorial workspace.',
      };
    case 'publish':
      if (mode === 'edit' && previousStatus === 'PUBLISHED') {
        return {
          title: 'Changes saved',
          description: 'Your edits are live on the site.',
        };
      }
      return {
        title: 'Article published',
        description: 'The story is now live on the site.',
      };
    case 'schedule':
      if (mode === 'edit' && previousStatus === 'SCHEDULED') {
        return {
          title: 'Schedule updated',
          description: 'The go-live time and content were saved.',
        };
      }
      return {
        title: 'Article scheduled',
        description: 'It will go live automatically at the chosen time.',
      };
    case 'unpublish':
      return {
        title: 'Moved to draft',
        description: 'The article is no longer visible on the public site.',
      };
    default:
      return { title: 'Changes saved' };
  }
}

const toastDefaults: ExternalToast = {
  duration: 4200,
};

function resolveToastArgs(
  descriptionOrOptions?: string | ExternalToast,
  options?: ExternalToast,
): ExternalToast {
  if (typeof descriptionOrOptions === 'string') {
    return { ...toastDefaults, description: descriptionOrOptions, ...options };
  }
  return { ...toastDefaults, ...descriptionOrOptions, ...options };
}

export const cmsToast = {
  success(title: string, descriptionOrOptions?: string | ExternalToast, options?: ExternalToast) {
    toast.success(title, resolveToastArgs(descriptionOrOptions, options));
  },
  error(title: string, descriptionOrOptions?: string | ExternalToast, options?: ExternalToast) {
    toast.error(title, resolveToastArgs(descriptionOrOptions, options));
  },
  info(title: string, descriptionOrOptions?: string | ExternalToast, options?: ExternalToast) {
    toast.info(title, resolveToastArgs(descriptionOrOptions, options));
  },
  articleSaved(
    intent: ArticleSaveIntent,
    mode: 'create' | 'edit',
    status: string,
    previousStatus?: string,
  ) {
    const { title, description } = getArticleSaveToast(intent, mode, status, previousStatus);
    cmsToast.success(title, description);
  },
};