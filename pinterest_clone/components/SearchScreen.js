import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";

const GET_USER_BY_USERNAME = gql`
  query Query($username: String) {
    userByUsername(username: $username) {
      _id
      name
      username
      email
    }
  }
`;

const POST_FOLLOW = gql`
  mutation Follow($input: FollowInput) {
    follow(input: $input) {
      _id
      followingId
      followerId
    }
  }
`;

const SearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [followedUsers, setFollowedUsers] = useState([]);
  const [doFollow] = useMutation(POST_FOLLOW);

  const { loading, error, data } = useQuery(GET_USER_BY_USERNAME, {
    variables: { username: search },
    skip: search.length === 0,
  });

  const handleSearch = (text) => {
    setSearch(text);
  };

  const handleFollow = async (userId, username) => {
    try {
      await doFollow({
        variables: {
          input: {
            followingId: userId,
          },
        },
      });
      setFollowedUsers((prevFollowedUsers) => [...prevFollowedUsers, userId]);
      Alert.alert("Success", `Following ${username}`, [
        {
          text: "OK",
        },
      ]);
    } catch (error) {
      Alert.alert("Already following this user.");
    }
  };

  const handleProfileNavigation = (user) => {
    // console.log("oper user ini", user);
    navigation.navigate("ProfileSearch", { user });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by username"
        value={search}
        onChangeText={handleSearch}
      />
      {loading && <ActivityIndicator size="large" color="black" />}
      {error && <Text>Error: {error.message}</Text>}
      <ScrollView>
        {data && data.userByUsername && (
          <TouchableOpacity
            key={data.userByUsername._id}
            onPress={() => handleProfileNavigation(data.userByUsername)}
          >
            <View style={styles.userContainer}>
              <Text style={styles.username}>
                {data.userByUsername.username}
              </Text>
              <TouchableOpacity
                disabled={followedUsers.includes(data.userByUsername._id)}
                style={
                  !followedUsers.includes(data.userByUsername._id)
                    ? styles.followButton
                    : styles.followedButton
                }
                onPress={() =>
                  handleFollow(
                    data.userByUsername._id,
                    data.userByUsername.username
                  )
                }
              >
                <Text style={styles.followButtonText}>
                  {followedUsers.includes(data.userByUsername._id)
                    ? "Followed"
                    : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  username: {
    fontSize: 18,
  },
  followButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
  },
  followedButton: {
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 5,
  },
  followButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default SearchScreen;
