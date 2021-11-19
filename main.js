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

const player = $('.player');
const heading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const audio = $('#audio');
const process = $('#progress');
const  prevSongBtn = $('.btn-prev');
const nextSongBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isReapeat: false,
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
    
  ],
  defaultProperties(){
    Object.defineProperty(this, 'currentSong', {
      get(){
        return this.songs[this.currentIndex];
      }
    })
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
    // When song play
    audio.onplay = function(){
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    }

    // When song pause 
    audio.onpause = function(){
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    }

    // When Seek audio
    process.onchange = (e) => {
      const seekTime = Math.floor(e.target.value * audio.duration /100);
      audio.currentTime = seekTime;
    }

    // currentTime audio has change
    audio.ontimeupdate = function(){
      const progressPercent = Math.floor(audio.currentTime/audio.duration *100) || 0;
      process.value = progressPercent;
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
      _this.render()
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
    }

    // Random song
    randomBtn.onclick = () => {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle('active', _this.isRandom);
      console.log(randomBtn);
    }

    // Repeat song
    repeatBtn.onclick = () => {
      _this.isReapeat = !_this.isReapeat;
      repeatBtn.classList.toggle('active', _this.isReapeat);
    }

    // Handle next song when audio ended
    audio.onended = () => {
      if(_this.isReapeat){
        audio.play();
      }
      else{
        nextSongBtn.click()
      }
    }
  },
  nextSong(){
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length-1){
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
    do{
      newIndex = Math.floor(Math.random() * this.songs.length)
    }while(this.currentIndex === newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  loadCurrentSong(){
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  render() {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}">
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

    $('.playlist').innerHTML = htmls.join('')
  },
  
  start(){
    // Define properties for object
    this.defaultProperties();

    // Listen / handle events (DOM events)
    this.handleEvent();

    //  Load inform of current song
    this.loadCurrentSong();
  
    //  Render playlist
    this.render();
  }
}
 
 app.start();
 
  