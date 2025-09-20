import { ResolutionContext } from "inversify";

import { AppModule } from "@/di";
import { ILogService } from "@/log";
import { IModalService } from "@/modal";

import { IPost } from "..";
import { PostDetailsPresenter } from "../post-details/post-details-presenter";
import { IPostListVM } from "./post-list.component";
import { IPostDetailsPresenter, PostListVM } from "./post-list.vm";

export const createPostListViewModel = (posts: IPost[], context: ResolutionContext): IPostListVM => {
  const modalService: IModalService = context.get(AppModule.MODAL);
  const detailsPresenter: IPostDetailsPresenter = new PostDetailsPresenter(modalService);
  const logService: ILogService = context.get(AppModule.LOG);

  return new PostListVM(
    posts,
    detailsPresenter,
    logService.createLogger(PostListVM.name),
  );
};
