import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import * as Permissions from "expo-permissions";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      cameraOpen: false,
      faceSquare: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: "red",
      },
      type: Camera.Constants.Type.front,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === "granted" });
  }

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
    }
    // add backend to save to file system
  };

  changeCamera = () => {
    const currType = this.state.type;
    this.setState({
      type:
        currType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  detectFaces = (face) => {
    const detectedFace = face.faces[0]
      ? {
          x: face.faces[0].bounds.origin.x,
          y: face.faces[0].bounds.origin.y,
          width: face.faces[0].bounds.size.width,
          height: face.faces[0].bounds.size.width,
        }
      : {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        };
    this.setState({ faceSquare: detectedFace });
  };

  render() {
    const { hasPermission } = this.state;
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={(ref) => {
              this.camera = ref;
            }}
            style={{ flex: 0.85 }}
            type={this.state.type}
            onFacesDetected={this.detectFaces}
            FaceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.fast,
              detectLandmarks: FaceDetector.Constants.Landmarks.all,
              runClassifications: FaceDetector.Constants.Classifications.none,
              minDetectionInterval: 5000,
              tracking: false,
            }}
          >
            <View
              style={{
                backgroundColor: "transparent",
                borderWidth: 2,
                borderColor: "black",
                position: "absolute",
                left: this.state.faceSquare.x,
                top: this.state.faceSquare.y,
                width: this.state.faceSquare.width,
                height: this.state.faceSquare.height,
              }}
            ></View>
          </Camera>
          <View style={styles.captureMenu}>
            <View style={styles.emptyView}></View>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => this.takePicture()}
            ></TouchableOpacity>
            <TouchableOpacity onPress={() => this.changeCamera()}>
              <MaterialCommunityIcons
                name="camera-switch"
                style={{ color: "#FFFFFF", fontSize: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyView: {
    height: 40,
    width: 40,
    // borderWidth: 1,
    // borderColor: "white",
  },
  captureMenu: {
    flex: 0.15,
    flexDirection: "row",
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "space-around",
  },
  circle: {
    borderColor: "#000000",
    borderRadius: 100,
    backgroundColor: "#FFFFFF",
    width: 75,
    height: 75,
  },
});
