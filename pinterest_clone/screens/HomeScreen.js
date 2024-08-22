import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Dimensions, Text } from "react-native";
import CardHome from "../components/CardHome";
import { gql, useQuery } from "@apollo/client";

const GET_POST = gql`
  query Posts {
    posts {
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

const HomeScreen = () => {
  // const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   setPosts(GET_POST[0]?.data?.posts);
  // }, []);
  // console.log("masuk login");
  const { loading, error, data } = useQuery(GET_POST);
  if (loading) return <Text>"Loading..."</Text>;
  if (error) return <Text>`Error! ${error.message}`</Text>;

  const { width } = Dimensions.get("window");
  const imageWidth = (width - 30) / 2;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data?.posts?.map((post) => {
        return (
          <View
            key={post._id}
            style={[
              styles.card,
              { width: imageWidth, height: imageWidth * (300 / 200) },
            ]}
          >
            <CardHome imgUrl={post.imgUrl} data={post} />
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingTop: 20,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default HomeScreen;
