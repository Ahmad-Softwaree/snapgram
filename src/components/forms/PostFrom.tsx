import { PostValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queryAndMutations";
import Loader from "../shared/Loader";

interface Props {
  post?: Models.Document;
  action: "Create" | "Update";
}

const PostFrom = ({ post, action }: Props) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
      file: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (!user.id) {
      return toast({
        title: "There is no user",
      });
    }
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });
      if (!updatedPost) {
        return toast({
          title: "Please try again",
        });
      } else {
        navigate(`/posts/${post.$id}`);
      }
    } else {
      const newPost = await createPost({
        ...values,
        userId: user.id,
      });
      console.log(newPost);

      if (!newPost) {
        return toast({
          title: "Please try again",
        });
      } else {
        navigate("/");
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tag (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button
            disabled={isCreating || isUpdating}
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            {isCreating || isUpdating ? (
              <Loader />
            ) : isCreating ? (
              "Submit"
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostFrom;
