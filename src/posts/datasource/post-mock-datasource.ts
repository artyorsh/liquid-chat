import { IPost, IPostsDatasource } from '..';

export class PostMockDatasource implements IPostsDatasource {

  private static SLEEP_MS: number = 1000;

  public getPosts = async (): Promise<IPost[]> => {
    await this.sleep(PostMockDatasource.SLEEP_MS);

    return new Array(10000).fill(null).map((_, index) => ({
      id: index.toString(),
      title: `Post ${index + 1}`,
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image_url: `https://picsum.photos/1000/1000?random=${index}`,
    }));
  };

  private sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
}
