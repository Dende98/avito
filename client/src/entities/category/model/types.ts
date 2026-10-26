export type Category = {
  id: string;
  name: string;
  slug: string;
  _count?: {
    listings: number;
  };
};
