import { fireEvent, render } from '@testing-library/react-native';

import { ILogger } from '@/log';

import { IPostVM, PostItem } from './post-item.component';
import { IPostListVM, PostList } from './post-list.component';
import { IPostDetailsPresenter, PostListVM } from './post-list.vm';

describe('PostItem', () => {
  let vm: IPostVM;

  beforeEach(() => {
    vm = {
      post: {
        id: '1',
        title: 'Post 1',
        body: 'Body 1',
        image_url: 'https://',
      },
      viewDetails: jest.fn(),
    };
  });

  it('should render given title', () => {
    const api = render(<PostItem vm={vm} />);
    expect(api.findByText(/Post 1/)).toBeTruthy();
  });

  it('should render given body', () => {
    const api = render(<PostItem vm={vm} />);
    expect(api.findByText(/Body 1/)).toBeTruthy();
  });

  it('should invoke viewDetails when pressed', () => {
    const api = render(
      <PostItem
        testID='post-item'
        vm={vm}
      />,
      {},
    );

    fireEvent.press(api.getByTestId('post-item'));
    expect(vm.viewDetails).toHaveBeenCalled();
  });
});

describe('PostsList', () => {

  let vm: IPostListVM;
  let logger: ILogger;

  const presenter: IPostDetailsPresenter = {
    viewDetails: jest.fn(),
  };

  beforeEach(() => {
    logger = jest.requireMock('@/log/log.service').LogService()
      .createLogger(`[Test] ${PostListVM.name}`);
    vm = new PostListVM([], presenter, logger);
  });

  it('should render given number of posts', () => {
    vm = new PostListVM([
      { id: '1', title: 'Post 1', body: 'Body 1', image_url: 'https://' },
      { id: '2', title: 'Post 2', body: 'Body 2', image_url: 'https://' },
    ], presenter, logger);

    const api = render(<PostList vm={vm} />);

    expect(api.getAllByTestId('post-item')).toHaveLength(2);
  });

  it('should invoke presenter#viewDetails when item pressed', () => {
    vm = new PostListVM([
      { id: '1', title: 'Post 1', body: 'Body 1', image_url: 'https://' },
      { id: '2', title: 'Post 2', body: 'Body 2', image_url: 'https://' },
    ], presenter, logger);

    const api = render(<PostList vm={vm} />);

    const firstPost = api.getAllByTestId('post-item')[0];
    fireEvent.press(firstPost);

    expect(presenter.viewDetails).toHaveBeenCalled();
  });
});
