/**
 * Reder song
 * Scroll top
 * Play / pause / seek
 * CD rotated
 * Next / previous
 * Random
 * Next / Repeat when ended
 * Active Song
 * Scroll active song into view
 * Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'PLAYER-STORAGE';

const player = $('.player');
const dashboard = $('.dashboard');
const heading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');

const audio = $('#audio');
const process = $('.progress-bar');
const currentTime = $('.current-time');
const durationTime = $('.duration-time');

const  prevSongBtn = $('.btn-prev');
const nextSongBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  randomSongList: [],
  songs: [
    {
      name:'Thay Lòng',
      singer: 'DIMZ, TVk, NHT',
      path: './assets/path/song1.mp3',
      image: './assets/img/song1.png',
    },
    {
      name:'Ái Nộ',
      singer: 'Yến Tatoo, Masew, Great',
      path: './assets/path/song2.mp3',
      image: './assets/img/song2.png',
    },
    {
      name:'Đông Phai Mờ Dáng Ai',
      singer: 'DatKaa, QT Beatz',
      path: './assets/path/song3.mp3',
      image: './assets/img/song3.png',
    },
    {
      name:'Cưới Luôn Được Không?',
      singer: 'YuniBoo, Goctoi Mixer',
      path: './assets/path/song4.mp3',
      image: './assets/img/song4.png',
    },
    {
      name:'Yêu Là Cưới',
      singer: 'Phát Hồ, X2X',
      path: './assets/path/song5.mp3',
      image: './assets/img/song5.png',
    },
    {
      name:'Go Home',
      singer: 'K-391, Mentum, Linko',
      path: './assets/path/song6.mp3',
      image: './assets/img/song6.png',
    },
    {
      name:'New Love',
      singer: 'Silk City, Ellie Goulding, Diplo, Mark Ronson',
      path: './assets/path/song7.mp3',
      image: './assets/img/song7.png',
    },
    {
      name:'Sorry',
      singer: 'Alan Walker, ISÁK',
      path: './assets/path/song8.mp3',
      image: './assets/img/song8.png',
    },
    {
      name:'Last Summer',
      singer: 'Tokyo Machine, Weird Genius, Lights',
      path: './assets/path/song9.mp3',
      image: './assets/img/song9.png',
    },
    {
      name:'Believers',
      singer: 'Alan Walker, Conor Maynard',
      path: './assets/path/song10.mp3',
      image: './assets/img/song10.png',
    },
  ],
  get currentSong(){
    return this.songs[this.currentIndex];
  },
  config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) ?? {},
  setConfig(key, value){
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  handleEvent(){
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Handle cd rotate/ pause
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)'},
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdThumbAnimate.pause();

    //  handle zoom in - out cd-thumbnail
    // document.onscroll = function() {
    //   const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //   const newCdWidth = cdWidth - scrollTop;
    //   cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : '0px';
    //   cd.style.opacity = newCdWidth / cdWidth;
    // }

    //  Handle playing mucsic
    playBtn.onclick = function() {
      if(!_this.isPlaying){
        audio.play();
      }else{
        audio.pause();
      }
    }

    // Handle take duration/current Time for Progress-area
    audio.onloadedmetadata= function (){
      durationTime.innerText = _this.covertTime(this.duration);
      currentTime.innerText = _this.covertTime(this.currentTime);

      // When song play
      this.onplay = function(){
        _this.isPlaying = true;
        player.classList.add('playing');
        cdThumbAnimate.play();
        _this.setConfig('currentIndex', _this.currentIndex);
      }

      // When song pause 
      this.onpause = function(){
        _this.isPlaying = false;
        player.classList.remove('playing');
        cdThumbAnimate.pause();
      }

      // currentTime audio was changed
      this.ontimeupdate = function(){
        const progressPercent = Math.floor(audio.currentTime/audio.duration *100) || 0;
        process.value = progressPercent;
        currentTime.innerText = _this.covertTime(this.currentTime);
      }

      // Handle next song when audio ended
      this.onended = function() {
        if(_this.isRepeat){
          audio.play();
        }
        else{
          nextSongBtn.click()
        }
      }
    };

    // When Seek audio
    process.oninput = (e) => {
      const seekTime = Math.floor(e.target.value * audio.duration /100);
      audio.currentTime = seekTime;
    }

    // Handle click nextSongBtn
    nextSongBtn.onclick = () => {
      if(_this.isRandom){
        _this.playRandomSong()
      }
      else{
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollActiveSong();
    }

    // Handle click prevSongBtn
    prevSongBtn.onclick = () => {
      if(_this.isRandom){
        _this.playRandomSong()
      }
      else{
        _this.prevSong();
      }
      audio.play();
      _this.render()
      _this.scrollActiveSong();
    }

    // Random song
    randomBtn.onclick = () => {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle('active', _this.isRandom);
      _this.setConfig('isRandom', _this.isRandom );
    }

    // Repeat song
    repeatBtn.onclick = () => {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat );
      repeatBtn.classList.toggle('active', _this.isRepeat);
    }

    playlist.onclick = (e) => {
      const songNode = e.target.closest('.song:not(.active)');
      const optionSongNode = e.target.closest('.song__option');
      if(songNode || optionSongNode){
        if(songNode){
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }
      }
    }
  },
  loadConfig(){
    Object.assign(this, this.config);
  },
  loadCurrentSong(){
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  covertTime(time){
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`
  },
  nextSong(){
    this.currentIndex++;
    if(this.currentIndex > this.songs.length-1){
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong(){
    this.currentIndex--;
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong(){
    let newIndex;

    if(this.randomSongList.length === this.songs.length){
      this.randomSongList = [];
    }

    do{
      newIndex = Math.floor(Math.random() * this.songs.length)
    }while(newIndex === this.currentIndex || this.randomSongList.includes(newIndex));

    this.currentIndex = newIndex;
    this.randomSongList.push(newIndex);
    this.setConfig('randomSongList', this.randomSongList);

    this.loadCurrentSong();
  },
  scrollActiveSong(){
    if(this.currentIndex <= 3){
      setTimeout(() =>{
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      }, 200)
    }else{
      setTimeout(() =>{
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 200);
    }
  },
  render() {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
          <div class="song__thumbnail" style="background-image: url('${song.image}')"></div>
          <div class="song__body">
            <h3 class="song__body-title">${song.name}</h3>
            <p class="song__body-author">${song.singer}</p>
          </div>
          <div class="song__option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
    })
    playlist.innerHTML = htmls.join('');
  },
  
  start(){
    // Assign configLocal into app
    this.loadConfig();

    //  Load inform of current song
    this.loadCurrentSong();

    // Listen / handle events (DOM events)
    this.handleEvent();

    //  Render playlist
    this.render();

    // Show initial status of reapeat & random button and songActived 
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
    this.scrollActiveSong();

    // playlist.style.height = (window.innerHeight - dashboard.clientHeight) + 'px';
  }
}
 
 app.start();
 
  