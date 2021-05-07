import React, { Component } from "react";
import BannerButton from "./banner-button";
import { Carousel } from "react-responsive-carousel";
import Modal from "./modal";
import Settings from "./settings";
import Login from "./login";
import { WalletOutlined } from "@ant-design/icons";
import firebase from "../firebase";
import { notification } from "antd";

const banners = require.context("../assets/images/banners", true);
export default class Banners extends Component {
  constructor(props) {
    super(props);
    const selectedCharacterEventWish = this.props.getFormattedCharacterEventWish(
      "kebabCase"
    );
    this.state = {
      selectedBanner: "epitome-invocation",
      selectedCharacterEventWish,
      banners: {
        "epitome-invocation": "SCUM ITEM",
      },
      wishes: {
        "beginners-wish": "beginnersWish",
        [selectedCharacterEventWish]: this.props.getFormattedCharacterEventWish(
          "camelCase",
          selectedCharacterEventWish
        ),
        "epitome-invocation": "epitomeInvocation",
        "wanderlust-invocation": "wanderlustInvocation",
      },
      wasBeginnersWishDisabled: false,
      isSettingsPageVisible: false,
      coin: 0,
      empty: true,
      key: "",
    };
  }

  componentDidMount() {
    this.toggleBeginnersWish(this.props.isBeginnersWishLimited);
    this.setState({
      selectedBanner: this.props.selectedBanner,
    });
    this.switchBanner("epitome-invocation");
    this.getUserInfo();
  }

  getUserInfo() {
    const db = firebase.firestore().collection("items");
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      db.where("username", "==", user.username)
        .where("key", "==", user.key)
        .get()
        .then((querySnapshot) => {
          localStorage.setItem("empty", querySnapshot.empty);
          this.setState({ empty: querySnapshot.empty });
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              localStorage.setItem("user", JSON.stringify(doc.data()));
              this.setState({
                coin: doc.data().coin,
                key: doc.data().key,
              });
            });
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isBeginnersWishLimited !== this.props.isBeginnersWishLimited
    ) {
      this.toggleBeginnersWish(this.props.isBeginnersWishLimited);
    }
    const newSelectedCharacterEventWish = this.props.getFormattedCharacterEventWish(
      "kebabCase"
    );
    // If the user selected a new banner
    const { selectedCharacterEventWish, selectedBanner } = this.state;
    const { isBeginnersWishLimited } = this.props;
    if (newSelectedCharacterEventWish !== selectedCharacterEventWish) {
      const { banners: oldBanners, wishes: oldWishes } = this.state;
      const banners = {};
      const wishes = {};
      for (const b in oldBanners) {
        if (selectedCharacterEventWish === b) {
          banners[newSelectedCharacterEventWish] = "Character Event Wish";
        } else {
          banners[b] = oldBanners[b];
        }
      }
      for (const w in oldWishes) {
        if (selectedCharacterEventWish === w) {
          wishes[
            newSelectedCharacterEventWish
          ] = this.props.getFormattedCharacterEventWish(
            "camelCase",
            newSelectedCharacterEventWish
          );
        } else {
          wishes[w] = oldWishes[w];
        }
      }
      let newSelectedBanner = null;
      if (selectedBanner === selectedCharacterEventWish) {
        newSelectedBanner = newSelectedCharacterEventWish;
      } else {
        newSelectedBanner = selectedBanner;
      }
      if (isBeginnersWishLimited) {
        delete banners["beginners-wish"];
        delete wishes["beginners-wish"];
      }
      this.setState({
        selectedCharacterEventWish: newSelectedCharacterEventWish,
        banners,
        wishes,
        selectedBanner: newSelectedBanner,
      });
    }
  }
  onCarouselChange(index) {
    this.switchBanner(Object.keys(this.state.banners)[index]);
  }
  switchBanner(selectedBanner) {
    this.setState({ selectedBanner }, () =>
      this.props.setCurrentDetails(selectedBanner)
    );
  }
  get bannerText() {
    return this.state.banners[this.state.selectedBanner];
  }
  toggleSettingsModal(isSettingsPageVisible) {
    this.setState({
      isSettingsPageVisible,
    });
  }
  toggleBeginnersWish(isLimited) {
    if (isLimited) {
      this.setState({
        selectedBanner: this.props.getFormattedCharacterEventWish("kebabCase"),
        banners: {
          "epitome-invocation": "SCUM ITEM",
        },
        wishes: {
          [this.props.getFormattedCharacterEventWish(
            "kebabCase"
          )]: this.props.getFormattedCharacterEventWish("camelCase"),
          "epitome-invocation": "epitomeInvocation",
          "wanderlust-invocation": "wanderlustInvocation",
        },
        wasBeginnersWishDisabled: isLimited,
      });
    } else {
      this.setState({
        banners: {
          "epitome-invocation": "SCUM ITEM",
        },
        wishes: {
          "beginners-wish": "beginnersWish",
          [this.props.getFormattedCharacterEventWish(
            "kebabCase"
          )]: this.props.getFormattedCharacterEventWish("camelCase"),
          "epitome-invocation": "epitomeInvocation",
          "wanderlust-invocation": "wanderlustInvocation",
        },
        wasBeginnersWishDisabled: isLimited,
      });
    }
  }
  wish1(wish, selectedBanner) {
    if (this.state.coin > 0 && this.state.coin > 9) {
      wish(this.state.wishes[selectedBanner], true);
      const db = firebase.firestore().collection("items");
      const minuscoin = this.state.coin - 9;
      db.doc(this.state.key)
        .update({
          coin: minuscoin,
        })
        .then((res) => {
          this.getUserInfo();
        });
    }
  }
  wish10(wish, isBeginnersWishOver10, selectedBanner) {
    if (this.state.coin >= 90) {
      if (isBeginnersWishOver10 && selectedBanner === "beginners-wish") return;
      wish(this.state.wishes[selectedBanner]);
      const db = firebase.firestore().collection("items");
      const minuscoin = this.state.coin - 90;
      db.doc(this.state.key)
        .update({
          coin: minuscoin,
        })
        .then((res) => {
          this.getUserInfo();
        });
    } else {
      notification["info"]({
        message: "Info",
        description: "เงินคุณไม่พอกรุณาติดต่อ Admin",
      });
    }
  }

  render() {
    const { selectedBanner, isSettingsPageVisible, coin, empty } = this.state;
    const {
      wasDisclaimerSeen,
      setView,
      setSelectedWish,
      hideModal,
      reset,
      wish,
      isBeginnersWishOver10,
      getFormattedCharacterEventWish,
      updateCharacterEventWish,
      saveData,
      userWishes,
    } = this.props;
    const bannerKeys = Object.keys(this.state.banners);
    const selectedBannerIndex = bannerKeys.findIndex(
      (b) => b === selectedBanner
    );
    return (
      <>
        {wasDisclaimerSeen ? null : <Modal hideModal={hideModal} />}
        {isSettingsPageVisible && (
          <Settings
            closeSettings={() => this.toggleSettingsModal(false)}
            reset={() => reset(selectedBanner)}
            updateCharacterEventWish={updateCharacterEventWish}
            getFormattedCharacterEventWish={getFormattedCharacterEventWish}
          />
        )}
        <div>
          <Login getUserInfo={() => this.getUserInfo()} />
        </div>
        <div className="wrapper banners">
          <div className="giws-banners-container">
            <div className="heading">
              <div className="current-banner">
                <div>{this.bannerText}</div>
              </div>
              <div className="select-banner">
                {bannerKeys.map((banner) => (
                  <BannerButton
                    key={banner}
                    isSelected={banner === selectedBanner}
                    className={banner}
                    onClick={() => this.switchBanner(banner)}
                  />
                ))}
              </div>
              <div className="coin">
                <WalletOutlined style={{ marginRight: 10 }} />{" "}
                {coin.toLocaleString()}
              </div>
            </div>
            <div className="carousel-container">
              <Carousel
                autoPlay={false}
                className={"carousel"}
                showThumbs={false}
                showIndicators={false}
                showStatus={false}
                emulateTouch={false}
                showArrows={false}
                infiniteLoop={true}
                selectedItem={selectedBannerIndex}
                onChange={this.onCarouselChange.bind(this)}
              >
                {bannerKeys.map((banner) => {
                  return (
                    <div key={banner} className={`banner-slide ${banner}`}>
                      <div
                        title={`Your wish counter, you have wished ${userWishes[banner]} times`}
                        className="wish-counter"
                      >
                        {userWishes[banner]}
                      </div>
                      <img src={banners(`./scum-banner.png`).default} />
                    </div>
                  );
                })}
              </Carousel>
            </div>
            <div className="action-container">
              <div className="button-container">
                {/* <button onClick={() => this.toggleSettingsModal(true)}>
                  Settings
                </button> */}
                {/* <button onClick={() => setView("details")}>Details</button> */}
                <button onClick={() => setView("inventory")}>Inventory</button>
              </div>
              <div className="wish-container d-flex justify-content-center">
                {!empty && (
                  <>
                    <button
                      disabled={this.state.coin < 9}
                      onClick={() => this.wish1(wish, selectedBanner)}
                      className="wish-button"
                    >
                      Search
                    </button>
                    <button
                      disabled={this.state.coin < 90}
                      className={`wish-button ${
                        selectedBanner === "beginners-wish" &&
                        isBeginnersWishOver10 &&
                        "disabled"
                      }`}
                      onClick={() =>
                        this.wish10(wish, isBeginnersWishOver10, selectedBanner)
                      }
                    >
                      Search x10
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
