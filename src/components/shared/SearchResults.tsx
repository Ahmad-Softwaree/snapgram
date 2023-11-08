import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

interface Props {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
}

const SearchResults = ({ isSearchFetching, searchPosts }: Props) => {
  if (isSearchFetching) return <Loader />;

  if (searchPosts && searchPosts.documents.length > 0) {
    return <GridPostList posts={searchPosts.documents} />;
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchResults;
