import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { gql, useQuery } from "@apollo/client";

const GET_USER_BY_ID = gql`
  query Query($id: ID!) {
    userById(id: $id) {
      _id
      name
      username
      email
      follower {
        _id
        followingId
        followerId
      }
      following {
        _id
        followingId
        followerId
      }
      followerDetail {
        _id
        username
        email
      }
      followingDetail {
        _id
        username
        email
      }
    }
  }
`;

const ProfileSearch = ({ route, navigation }) => {
  // console.log(route);
  // console.log("masuk sini");
  const { user } = route.params;
  // console.log("ini di profile search", user);
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: user._id },
  });

  // console.log(data);
  const handleFollowers = () => {
    navigation.navigate("FollowScreen", {
      data: data.userById.followerDetail,
      title: "Followers",
    });
  };

  const handleFollowing = () => {
    navigation.navigate("FollowScreen", {
      data: data.userById.followingDetail,
      title: "Following",
    });
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{
          uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        }}
      />
      <Text style={styles.name}>{data.userById.name}</Text>
      <Text style={styles.info}>Username: {data.userById.username}</Text>
      <Text style={styles.info}>Email: {data.userById.email}</Text>

      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={handleFollowers}>
          <View style={styles.stat}>
            <Text style={styles.statCount}>
              {data.userById.follower.length}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFollowing}>
          <View style={styles.stat}>
            <Text style={styles.statCount}>
              {data.userById.following.length}
            </Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
    paddingTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  statsContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  stat: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#333",
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "black",
    borderRadius: 5,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ProfileSearch;
