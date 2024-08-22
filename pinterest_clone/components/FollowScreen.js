import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const FollowScreen = ({ route }) => {
  const { data, title } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView>
        {data.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.username}>{item.username}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  username: {
    fontSize: 18,
  },
});

export default FollowScreen;
