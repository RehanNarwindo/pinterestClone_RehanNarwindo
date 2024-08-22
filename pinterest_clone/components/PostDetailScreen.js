import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_POST_BY_ID = gql`
  query PostById($postByIdId: ID!) {
    postById(id: $postByIdId) {
      _id
      content
      tags
      imgUrl
      authorId
      author {
        username
        email
        _id
      }
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
    }
  }
`;

const POST_LIKE = gql`
  mutation AddLike($postId: ID!) {
    addLike(postId: $postId)
  }
`;

const POST_COMMENT = gql`
  mutation Mutation($content: String!, $postId: ID!) {
    addComment(content: $content, postId: $postId)
  }
`;

const PostDetailScreen = ({ route }) => {
  const { id } = route.params;
  const { loading, error, data, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { postByIdId: id },
  });

  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [doAddComment] = useMutation(POST_COMMENT);
  const [doAddLike] = useMutation(POST_LIKE);

  useEffect(() => {
    if (data) {
      const userLiked = data.postById.likes
        ? data.postById.likes.some((like) => like.username === "current_user")
        : false;
      setLiked(userLiked);
      setLikeCount(data.postById.likes ? data.postById.likes.length : 0);
    }
  }, [data]);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  if (error) return <Text>Error: {error.message}</Text>;

  const post = data.postById;

  const handleLike = async () => {
    if (!liked) {
      try {
        const result = await doAddLike({
          variables: {
            postId: post._id,
          },
        });
        setLiked(true);
        refetch();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const result = await doAddComment({
        variables: {
          content: comment,
          postId: post._id,
        },
      });
      Alert.alert("Success", "Add comment successfully", [
        {
          text: "OK",
        },
      ]);
      refetch();
      setComment("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // const handleFollow = () => {
  //   setIsFollowing(!isFollowing);
  // };

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text style={styles.commentContent}>{item.content}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.containerImg}>
        <Image source={{ uri: post.imgUrl }} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.authorContainer}>
          <Text style={styles.content}>
            Author: {post.author ? post.author.username : "Unknown"}
          </Text>
          {/* <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
            <Text style={styles.followButtonText}>
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity> */}
        </View>
        <Text style={styles.content}>{post.content}</Text>
        <Text style={styles.tags}>{post.tags.join(", ")}</Text>
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.stat} onPress={handleLike}>
            <FontAwesome
              name="heart"
              size={24}
              color={liked ? "red" : "gray"}
            />
            <Text style={styles.statCount}>{likeCount}</Text>
          </TouchableOpacity>
          <View style={styles.stat}>
            <FontAwesome name="comment" size={24} color="gray" />
            <Text style={styles.statCount}>
              {post.comments ? post.comments.length : 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={post.comments}
        renderItem={renderComment}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.commentsList}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={styles.commentButton}
          onPress={handleCommentSubmit}
        >
          <Text style={styles.commentButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerImg: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
    height: 600,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  authorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  content: {
    fontSize: 18,
    marginBottom: 5,
  },
  followButton: {
    backgroundColor: "#000",
    padding: 5,
    borderRadius: 5,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  tags: {
    fontSize: 16,
    color: "gray",
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statCount: {
    fontSize: 16,
    marginLeft: 5,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
  },
  commentButtonText: {
    color: "white",
    fontSize: 16,
  },
  commentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  comment: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentUsername: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentContent: {
    fontSize: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
});

export default PostDetailScreen;
