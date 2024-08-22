import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

const CardHome = ({ imgUrl, data }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("PostDetail", { post: data, id: data._id })
      }
      style={styles.imageContainer}
    >
      <Image source={{ uri: imgUrl }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    margin: 3,
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default CardHome;
