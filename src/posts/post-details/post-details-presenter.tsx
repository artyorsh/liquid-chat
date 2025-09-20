import { IModalService, PresentationType } from '@/modal';

import { IPost } from '..';
import { IPostDetailsCallbacks, IPostDetailsPresenter } from '../posts-list/posts-list.vm';
import { PostDetails } from './post-details.component';

export class PostDetailsPresenter implements IPostDetailsPresenter {

  constructor(private modalService: IModalService) {}

  public viewDetails(post: IPost, callbacks: IPostDetailsCallbacks): Promise<string> {
    return this.modalService.show(controller => (
      <PostDetails
        post={post}
        markHidden={async () => {
          await controller.resolve();
          callbacks.markHidden(post);
        }}
        close={() => {
          return controller.resolve();
        }}
      />
    ), PresentationType.BOTTOM_SHEET);
  }
}
