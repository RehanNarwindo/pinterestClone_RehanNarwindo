import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../authContext";
import * as SecureStore from "expo-secure-store";
import { gql, useQuery } from "@apollo/client";

const GET_PROFILE_USER_BY_USERNAME = gql`
  query Query($username: String) {
    userByUsername(username: $username) {
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

const ProfileScreen = ({ navigation }) => {
  const { setIsSignedIn } = useContext(AuthContext);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await SecureStore.getItemAsync("username");
        // console.log("Stored username:", storedUsername);
        setUsername(storedUsername);
      } catch (error) {
        console.error("Error retrieving username from SecureStore", error);
      }
    };

    fetchUsername();
  }, []);

  const { loading, error, data } = useQuery(GET_PROFILE_USER_BY_USERNAME, {
    variables: { username },
    skip: !username,
  });

  useEffect(() => {
    // console.log("ini loading", loading);
    // console.log("ini error", error);
    // console.log("ini data", data);
  }, [loading, error, data]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    setIsSignedIn(false);
  };

  const handleFollowers = () => {
    if (data) {
      navigation.navigate("FollowScreen", {
        data: data.userByUsername.followerDetail,
        title: "Followers",
      });
    }
  };

  const handleFollowing = () => {
    if (data) {
      navigation.navigate("FollowScreen", {
        data: data.userByUsername.followingDetail,
        title: "Following",
      });
    }
  };

  if (!username || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{
          uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        }}
      />
      <Text style={styles.name}>{data.userByUsername.name}</Text>
      <Text style={styles.info}>Username: {data.userByUsername.username}</Text>
      <Text style={styles.info}>Email: {data.userByUsername.email}</Text>

      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={handleFollowers}>
          <View style={styles.stat}>
            <Text style={styles.statCount}>
              {data.userByUsername.follower.length}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFollowing}>
          <View style={styles.stat}>
            <Text style={styles.statCount}>
              {data.userByUsername.following.length}
            </Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
