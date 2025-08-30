export default class SoundManager {
  constructor(scene) {
    this.scene = scene;

    this.splat = scene.sound.add("splat").setVolume(0.2);
    this.fail = scene.sound.add("fail").setVolume(0.2);
    this.extra = scene.sound.add("extra").setVolume(0.2);
    this.bgm = scene.sound.add("bgm").setLoop(true).setVolume(0.5);

    this.bgm.play();

    this.muteToggleBtn = document.querySelector("#muteToggleBtn");
    this.muteToggleBtn.addEventListener("click", () => {
      this.bgm.setMute(!this.bgm.mute);
      this.muteToggleBtn.textContent = this.bgm.mute ? "🔇" : "🔊";
    });
  }

  playSplat() {
    this.splat.play();
  }

  playFail() {
    this.fail.play();
  }

  playExtra() {
    this.extra.play();
  }
}
