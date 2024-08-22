import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../authContext"; // pastikan path ini sesuai dengan struktur proyek Anda

const ADD_POST = gql`
  mutation Mutation($content: String, $tags: [String], $imgUrl: String) {
    addPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
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

const GET_POSTS = gql`
  query {
    posts {
      _id
      content
      tags
      imgUrl
      author {
        username
      }
    }
  }
`;

const CreatePostScreen = () => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [doAddPost, { loading }] = useMutation(ADD_POST);
  const navigation = useNavigation();
  const { setIsSignedIn } = useContext(AuthContext);

  const handleCreatePost = async () => {
    try {
      await doAddPost({
        variables: {
          content: content,
          imgUrl: imgUrl,
          tags: tags.split(",").map((tag) => tag.trim()),
        },
        refetchQueries: [{ query: GET_POSTS }],
      });
      Alert.alert("Success", "Created new post successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message);
    }

    setContent("");
    setTags("");
    setImgUrl("");
  };

  // const handleLogout = async () => {
  //   await SecureStore.deleteItemAsync("accessToken");
  //   setIsSignedIn(false);
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter post content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Enter tags (comma separated)"
        value={tags}
        onChangeText={setTags}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter image URL"
        value={imgUrl}
        onChangeText={setImgUrl}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreatePost}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Post"}
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "black",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "50%",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "black",
    borderRadius: 5,
    alignSelf: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default CreatePostScreen;
