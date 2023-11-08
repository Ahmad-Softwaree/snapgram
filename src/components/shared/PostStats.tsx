import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queryAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useState, useEffect } from "react";
import Loader from "./Loader";

interface Props {
  post: Models.Document;
  userId: string;
}
const PostStats = ({ post, userId }: Props) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  useEffect(() => {
    if (currentUser) {
      setIsSaved(
        currentUser?.save.find(
          (record: Models.Document) => record.post.$id === post.$id
        )
      );
    }
  }, [currentUser]);

  const handleLikePost = (e: React.MouseEvent) => {
    //stop any other actions if there is link in the post
    e.stopPropagation();

    let newLikes = [...likes];

    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);

    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    //stop any other actions if there is link in the post
    e.stopPropagation();
    const savedPostRecord = currentUser?.save.find(
      (record: Models.Document) => record.post.$id === post.$id
    );
    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post.$id, userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={`/assets/icons/${
            checkIsLiked(likes, userId) ? "liked" : "like"
          }.svg`}
          alt="like"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleLikePost}
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2 mr-5">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={`/assets/icons/${isSaved ? "saved" : "save"}.svg`}
            alt="like"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
