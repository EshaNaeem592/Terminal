import React, { useEffect, useState } from "react";
import { app, database } from "./firebase";
import { ref, get } from "firebase/database";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getDataFromFirebase = async () => {
      try {
        const dataRef = ref(database, '/Table');
        const snapshot = await get(dataRef);

        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error getting data from Firebase:", error);
      }
    };

    // Call the function to get data when the component mounts
    getDataFromFirebase();
  }, []); // The empty dependency array ensures that this effect runs only once on mount

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        <Text style={styles.boldText}>Title:</Text> {item.title},{" "}
        <Text style={styles.boldText}>Price:</Text> {item.price}
        <Text style={styles.boldText}>Description:</Text> {item.description}
      </Text>
      {item.img && <Image source={{ uri: item.img }} style={styles.image} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Data from Firebase</Text>
      {data ? (
        <FlatList
          data={Object.values(data)}
          renderItem={renderItem}
          keyExtractor={(item) => item.key.toString()}
        />
      ) : (
        <Text>Loading data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

export default App;
