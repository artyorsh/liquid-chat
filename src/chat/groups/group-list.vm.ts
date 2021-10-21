import { computed, makeAutoObservable, observable } from 'mobx';

import { INavigationLifecycleListener, IRouter } from '@/router';

import { IGroupListVM } from './group-list.component';
import { IGroupListItemVM } from './group-list-item.component';

export type ITopic = string;

export interface IGroupListDatasource {
  getTopics(): Promise<ITopic[]>;
}

export class GroupListVM implements IGroupListVM, INavigationLifecycleListener {

  @observable public loading: boolean = true;
  @observable private topics: ITopic[] = [];

  @computed public get groups(): IGroupListItemVM[] {
    return this.topics
      .map(topic => this.createGroupListItemVM(topic));
  }

  constructor(private router: IRouter, private dataSource: IGroupListDatasource) {
    router.subscribe('/chats', this);
    makeAutoObservable(this);
  }

  public onFocus = async (): Promise<void> => {
    this.topics = await this.dataSource.getTopics();
    this.loading = false;
  };

  public onBlur(): void {
    // no-op
  }

  private createGroupListItemVM(topic: ITopic): IGroupListItemVM {
    return {
      title: topic,
      viewDetails: () => this.router.navigate('/chats/:id', { topic }),
    };
  }
}
