import { IPost, IPostsDatasource } from '..';

export interface IPostMockDatasourceConfig {
  imageSize?: number;
  useCachedImages?: boolean;
}

const defaultConfig: IPostMockDatasourceConfig = {
  imageSize: 576,
  useCachedImages: false,
};

export class PostMockDatasource implements IPostsDatasource {

  private static SLEEP_MS: number = 1000;

  constructor(private config: IPostMockDatasourceConfig = defaultConfig) {

  }

  public getPosts = async (): Promise<IPost[]> => {
    await this.sleep(PostMockDatasource.SLEEP_MS);

    return new Array(10000).fill(null).map((_, index) => {
      const imageIndex: number = this.config.useCachedImages ? index : Date.now() + index;

      return ({
        id: index.toString(),
        title: `Post ${index + 1}`,
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image_url: `https://picsum.photos/${this.config.imageSize}/${this.config.imageSize}?i=${imageIndex}`,
      });
    });
  };

  private sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
}
