const store = new Vuex.Store({
    state: {
        title: 'TicketMyShow',
        condition: 0,
        ltoken: 1, // Not used in this js file
        stoken: 1, // Not used in this js file
        maintoken: 0, // Not used in this js file
        movie_condition: 0,  // Using this for
        movie_theatre_name: '',
        main_app_condition: localStorage.getItem('some_random_key') ? Number(localStorage.getItem('some_random_key')) : 0,
        main_app_condition_movie_id: localStorage.getItem('some_random_key_two') ? Number(localStorage.getItem('some_random_key_two')) : 0,
        movie_info: [],
        theatre_info: [],
        showtime_info: [],
        movies_list: localStorage.getItem('some_random_key_three')? JSON.parse(localStorage.getItem('some_random_key_three')) : []
    },
    mutations: {
        setLToken(state, value) { // Not used in this js file
            state.ltoken = value;
        },
        setSToken(state, value) { // Not used in this js file
            state.stoken = value;
        },
        setMainToken(state, value) { // Not used in this js file
            state.maintoken = value;
        },
        setcondition(state,value) {
            state.condition = value;
        },
        setMovieCondition(state, value1) {
            state.movie_condition = value1;
        },
        setMovieList(state, mlist) {
            if(mlist===0){
                localStorage.removeItem('some_random_key_three');
            }
            state.movies_list = mlist;
            localStorage.setItem('some_random_key_three', JSON.stringify(mlist));
        },
        set_main_app_condition(state,{value1,value2}) {
            state.main_app_condition = value1;
            state.main_app_condition_movie_id = value2;
            localStorage.setItem('some_random_key',value1);
            localStorage.setItem('some_random_key_two',value2);
        },
        setMovieInfo(state,value) {
            state.movie_info = value;
        },
        setTheatreInfo(state,value) {
            state.theatre_info = value;
        },
        setShowtimeInfo(state,value) {
            state.showtime_info = value;
        },
    }
});

const AdminDashboard = {
    template: `
        <div v-if="this.$store.state.condition === 0">
            <nav class="bg-gradient-to-r from-gray-800 px-4 py-4">
                <ul class="flex space-x-4">
                    <li class="text-white font-bold text-2xl cursor-pointer">{{title}}</li>
                    <li class="text-gray-400 hover:text-white cursor-pointer"><router-link to="/admin/dashboard">Dashboard</router-link></li>
                    <li class="text-gray-400 hover:text-white cursor-pointer"><router-link to="/admin/users">Users</router-link></li>
                    <li class="text-gray-400 hover:text-white cursor-pointer"><router-link to="/admin/movies">Movies</router-link></li>
                    <li class="text-gray-400 hover:text-white cursor-pointer"><router-link to="/admin/theatres">Theatres</router-link></li>
                    <li class="text-gray-400 hover:text-white cursor-pointer"><router-link to="/admin/showtimes">Showtimes</router-link></li>
                    <li class="text-gray-400 hover:text-white cursor-pointer"><router-link to="/admin/bookings">Bookings</router-link></li>
                    <li class="text-gray-400 hover:text-white cursor-pointer"><router-link to="/admin/reviews">Reviews</router-link></li>
                    <button class="rounded-lg px-2 bg-white hover:text-white font-bold hover:font-bold hover:bg-black active:bg-gray-800 ring-5 ring-black outline-none focus:outline-none focus:ring focus:ring-white">
                        <router-link to="/">Log-out</router-link>
                    </button>
                </ul>
            </nav>
            <div class="container mx-auto mt-8">
                <router-view></router-view>
            </div>
        </div>
        <div v-else-if="this.$store.state.condition === 1" class="mt-20">
            <div class="container mx-auto mt-5">
                <div class="bg-slate-700 text-white p-4 rounded-lg shadow-lg">
                    <button @click="setcondition(0)" class="bg-black text-white hover:text-black hover:bg-white px-2 py-2 rounded-lg mb-2">Go back</button>
                    <div class="bg-gray-800 text-white rounded-lg p-3 mb-4">
                        <p class="text-xl mb-0">Movies Details</p>
                    </div>
                    <form @submit.prevent="addMovie" method="post" class="grid grid-cols-1 md:grid-cols-2 gap-4" enctype="multipart/form-data">
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Title</label>
                            <input v-model="movie.title" class="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="text" name="title" required>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Description</label>
                            <input v-model="movie.description" class="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="text" name="description" required>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Release Date</label>
                            <input v-model="movie.release_date" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="date" name="release_date" required>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Duration</label>
                            <input v-model="movie.duration" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="time" name="duration" required>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Genre</label>
                            <select v-model="movie.genre" name="genre" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                                <option v-for="(genre, index) in genres" :key="index" :value="genre.name">{{ genre.name }}</option>
                            </select>
                        </div>

                        <div class="col-span-1 md:col-span-2">
                            <button class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors" type="submit">Add Movie</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-else-if="this.$store.state.condition === 2" class="mt-20">
            <div class="container mx-auto mt-5">
                <div class="bg-slate-700 text-white p-4 rounded-lg shadow-lg">
                    <button @click="setcondition(0)" class="bg-black text-white hover:text-black hover:bg-white px-2 py-2 rounded-lg mb-2">Go back</button>
                    <div class="bg-gray-800 text-white rounded-lg p-3 mb-4">
                        <p class="text-xl mb-0">Theatre Details</p>
                    </div>
                    <form @submit.prevent="addTheatre" method="post" class="grid grid-cols-1 md:grid-cols-2 gap-4" enctype="multipart/form-data">
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Name</label>
                            <input v-model="theatre.name" class="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="text" required>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Location</label>
                            <input v-model="theatre.location" class="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="text" required>
                        </div>
                        <div class="col-span-1 md:col-span-2">
                            <button class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors" type="submit">Add Theatre</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-else-if="this.$store.state.condition === 3" class="mt-20">
            <div class="container mx-auto mt-5">
            <div class="bg-slate-700 text-white p-4 rounded-lg shadow-lg">
                <button @click="setcondition(0)" class="bg-black text-white hover:text-black hover:bg-white px-2 py-2 rounded-lg mb-2">
                    Go back
                </button>
                <div class="bg-gray-800 text-white rounded-lg p-3 mb-4">
                    <p class="text-xl mb-0">Showtimes Details</p>
                </div>
                <form @submit.prevent="addShowtime" method="post" class="grid grid-cols-1 md:grid-cols-2 gap-4" enctype="multipart/form-data">
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-gray-300">Movie to Assign</label>
                        <select v-model="showtime.movie_id" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                        <option v-for="(mov, index) in Mov" :key="index" :value="mov.title">{{ mov.title }}</option>
                        </select>
                    </div>
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-gray-300">Theatre to Assign</label>
                        <select v-model="showtime.theatre_id" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                        <option v-for="(thea, index) in Thea" :key="index" :value="thea.name">{{ thea.name }}</option>
                        </select>
                    </div>
                    <div class="col-span-1">
                        <label class="block text-sm font-medium text-gray-300">Showtimings</label>
                        <input v-model="showtime.show_time" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="datetime-local" required>
                    </div>
                    <div class="col-span-1 md:col-span-2">
                        <button class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors" type="submit">Add Showtime</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
        <div v-else-if="this.$store.state.condition === 4" class="mt-20">
            <div class="container mx-auto mt-5">
                <div class="bg-slate-700 text-white p-4 rounded-lg shadow-lg">
                    <button @click="setcondition(0)" class="bg-black text-white hover:text-black hover:bg-white px-2 py-2 rounded-lg mb-2">Go back</button>
                    <div class="bg-gray-800 text-white rounded-lg p-3 mb-4">
                        <p class="text-xl mb-0">Edit Movie</p>
                    </div>
                    <form @submit.prevent="editMovie" method="post" class="grid grid-cols-1 md:grid-cols-2 gap-4" enctype="multipart/form-data">
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Title</label>
                            <input v-model="editMovieInfo.title" class="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="text" required>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Description</label>
                            <input v-model="editMovieInfo.description" class="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="text" required>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Release Date</label>
                            <input v-model="editMovieInfo.release_date" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="date" required>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Duration</label>
                            <input v-model="editMovieInfo.duration" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="time" required>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Genre</label>
                            <select v-model="editMovieInfo.genre" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                                <option v-for="(genre, index) in genres" :key="index" :value="genre.name">{{ genre.name }}</option>
                            </select>
                        </div>
                        <div class="col-span-1 md:col-span-2">
                            <button class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors" type="submit">Edit Movie</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-else-if="this.$store.state.condition === 5" class="mt-20">
            <div class="container mx-auto mt-5">
                <div class="bg-slate-700 text-white p-4 rounded-lg shadow-lg">
                    <button @click="setcondition(0)" class="bg-black text-white hover:text-black hover:bg-white px-2 py-2 rounded-lg mb-2">Go back</button>
                    <div class="bg-gray-800 text-white rounded-lg p-3 mb-4">
                        <p class="text-xl mb-0">Edit Theatre</p>
                    </div>
                    <form @submit.prevent="editTheatre" method="post" class="grid grid-cols-1 md:grid-cols-2 gap-4" enctype="multipart/form-data">
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Name</label>
                            <input v-model="editTheatreInfo.name" class="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="text" required>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Location</label>
                            <input v-model="editTheatreInfo.location" class="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="text" required>
                        </div>
                        <div class="col-span-1 md:col-span-2">
                            <button class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors" type="submit">Edit Theatre</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-else-if="this.$store.state.condition === 6" class="mt-20">
            <div class="container mx-auto mt-5">
                <div class="bg-slate-700 text-white p-4 rounded-lg shadow-lg">
                    <button @click="setcondition(0)" class="bg-black text-white hover:text-black hover:bg-white px-2 py-2 rounded-lg mb-2">Go back</button>
                    <div class="bg-gray-800 text-white rounded-lg p-3 mb-4">
                        <p class="text-xl mb-0">Edit Showtime</p>
                    </div>
                    <form @submit.prevent="editShowtime" method="post" class="grid grid-cols-1 md:grid-cols-2 gap-4" enctype="multipart/form-data">
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Movie to Edit</label>
                            <select v-model="editShowtimeInfo.movie_id" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                            <option v-for="(mov, index) in Mov" :key="index" :value="mov.title">{{ mov.title }}</option>
                            </select>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Theatre to Edit</label>
                            <select v-model="editShowtimeInfo.theatre_id" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                            <option v-for="(thea, index) in Thea" :key="index" :value="thea.name">{{ thea.name }}</option>
                            </select>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-300">Showtimings</label>
                            <input v-model="editShowtimeInfo.showtime" class="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" type="datetime-local" required>
                        </div>
                        <div class="col-span-1 md:col-span-2">
                            <button class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors" type="submit">Edit Showtime</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    `,
    data() {
        return {
            title:'TicketMyShow',
            movie: {
                title: '',
                description: '',
                release_date: null,
                duration: null,
                genre: ''
            },
            theatre: {
                name: '',
                location: '',
            },
            showtime: {
                movie_id: '',
                theatre_id: '',
                show_time: null
            },
            genres: [],
            editMovieInfo: [],
            editTheatreInfo: [],
            editShowtimeInfo: [],
            Mov:[],
            Thea:[],
            ShowT:[]
        }
    },
    mounted() {
        fetch('/api/genre')
        .then(response => response.json())
        .then(data => {
            this.genres = data;
        });
        fetch('/api/getmovies')
        .then(response => response.json())
        .then(data =>{
            this.Mov = data;
        })
        fetch('/api/gettheatres')
        .then(response => response.json())
        .then(data =>{
            this.Thea = data;
        })
        fetch('/api/getshowtimes')
        .then(response => response.json())
        .then(data =>{
            this.ShowT = data;
        })
    },
    updated() {
        this.editMovieInfo = this.$store.state.movie_info;
        this.editTheatreInfo = this.$store.state.theatre_info;
        this.editShowtimeInfo = this.$store.state.showtime_info;
    },
    methods:{
        addMovie() {
            const formData = new FormData();
            formData.append('title', this.movie.title);
            formData.append('description', this.movie.description);
            formData.append('release_date', this.movie.release_date);
            formData.append('duration', this.movie.duration);
            formData.append('genre', this.movie.genre);
    
            fetch('/api/postmovies', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Reset the form
                    this.movie.title = '';
                    this.movie.description = '';
                    this.movie.release_date = null;
                    this.movie.duration = null;
                    this.movie.genre = '';
                    this.$store.commit('setcondition', 0);
                } else {
                    alert('Failed to add movie');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        addTheatre(){
            const formData = new FormData();
            formData.append('name',this.theatre.name)
            formData.append('location',this.theatre.location)
            fetch('/api/posttheatres',{
                method:"POST",
                body:formData
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.success){
                    this.theatre.name='';
                    this.theatre.location='';
                    this.$store.commit('setcondition', 0);
                }else{
                    alert('Failed to add theatre');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
        },
        addShowtime(){
            const formData = new FormData();
            formData.append('movie_id',this.showtime.movie_id)
            formData.append('theatre_id',this.showtime.theatre_id)
            formData.append('show_time',this.showtime.show_time)
            fetch('/api/postshowtime',{
                method:"POST",
                body:formData
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.success){
                    this.showtime.movie_id = '';
                    this.showtime.theatre_id = '';
                    this.showtime.show_time = null;
                    this.$store.commit('setcondition', 0);
                }else{
                    alert('Failed to add showtime');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
        },
        editMovie(){
            const formData = new FormData();
            formData.append('id', this.editMovieInfo.id)
            formData.append('title', this.editMovieInfo.title);
            formData.append('description', this.editMovieInfo.description);
            formData.append('release_date', this.editMovieInfo.release_date);
            formData.append('duration', this.editMovieInfo.duration);
            formData.append('genre', this.editMovieInfo.genre);
            
            fetch('/api/edit_movie', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.$store.commit('setcondition', 0);
                } else {
                    alert('Failed to edit movie');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });



        },
        editTheatre(){
            const formData = new FormData();
            formData.append('id', this.editTheatreInfo.id)
            formData.append('name', this.editTheatreInfo.name);
            formData.append('location', this.editTheatreInfo.location);
            // formData.append('capacity', this.editTheatreInfo.capacity);
            

            fetch('/api/edit_theatre', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.$store.commit('setcondition', 0);
                } else {
                    alert('Failed to edit theatre');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        editShowtime(){
            const formData = new FormData();
            formData.append('id', this.editShowtimeInfo.id)
            formData.append('movie_id', this.editShowtimeInfo.movie_id);
            formData.append('theatre_id', this.editShowtimeInfo.theatre_id);
            formData.append('showtime', this.editShowtimeInfo.showtime);
            

            fetch('/api/edit_showtime', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.$store.commit('setcondition', 0);
                } else {
                    alert('Failed to edit Showtime');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        setcondition(value) {
            this.$store.commit('setcondition', value);
        }
    }
};

const Dashboard = {
    data() {
        return {
            total_movies: 0,
            total_showtimes: 0,
            total_theatres: 0,
            total_users: 0,
            total_bookings: 0,
            total_reviews: 0,
            total_revenue: 0,
            average_movie_rating: 0,
            most_popular_movie: '',
            user_activity: {},
            movie_release_trends: {},
            pieChartUrl: '',
            topMoviesUrl: '',
            bookingTrendUrl: '',
            releaseTrendUrl: '',
            errorMessage: ''
        };
    },
    template: `
        <div class="container mx-auto p-4">
            <h2 class="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard Stats</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
                    <h3 class="text-xl font-semibold text-gray-800">Total Movies</h3>
                    <p class="text-2xl text-gray-700">{{ total_movies }}</p>
                </div>
                <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
                    <h3 class="text-xl font-semibold text-gray-800">Total Showtimes</h3>
                    <p class="text-2xl text-gray-700">{{ total_showtimes }}</p>
                </div>
                <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
                    <h3 class="text-xl font-semibold text-gray-800">Total Theatres</h3>
                    <p class="text-2xl text-gray-700">{{ total_theatres }}</p>
                </div>
                <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
                    <h3 class="text-xl font-semibold text-gray-800">Total Bookings</h3>
                    <p class="text-2xl text-gray-700">{{ total_bookings }}</p>
                </div>
                <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
                    <h3 class="text-xl font-semibold text-gray-800">Total Reviews</h3>
                    <p class="text-2xl text-gray-700">{{ total_reviews }}</p>
                </div>
                <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
                    <h3 class="text-xl font-semibold text-gray-800">Average Movie Rating</h3>
                    <p class="text-2xl text-gray-700">{{ average_movie_rating.toFixed(1) }}</p>
                </div>
                <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
                    <h3 class="text-xl font-semibold text-gray-800">Most Popular Movie</h3>
                    <p class="text-2xl text-gray-700">{{ most_popular_movie }}</p>
                </div>
                <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
                    <h3 class="text-xl font-semibold text-gray-800">Total Revenue</h3>
                    <p class="text-2xl text-gray-700">{{ total_revenue }}</p>
                </div>
            </div>
            
            <h3 class="text-2xl font-semibold text-gray-800 mb-4">Charts</h3>
            <div class="space-y-4">
                <img v-if="pieChartUrl" :src="pieChartUrl" alt="Pie Chart" class="w-full h-auto rounded-lg shadow-md">
                <img v-if="topMoviesUrl" :src="topMoviesUrl" alt="Top Movies Chart" class="w-full h-auto rounded-lg shadow-md">
                <img v-if="bookingTrendUrl" :src="bookingTrendUrl" alt="Booking Trend Chart" class="w-full h-auto rounded-lg shadow-md">
                <img v-if="releaseTrendUrl" :src="releaseTrendUrl" alt="Release Trend Chart" class="w-full h-auto rounded-lg shadow-md">
            </div>
            
            <!-- Optional: Add an error message here if needed -->
            <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
        </div>
    `,
    mounted() {
        this.fetchStatistics();
    },
    methods: {
        async fetchStatistics() {
            try {
                const response = await fetch('/api/admin/statistics');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                this.total_movies = data.total_movies;
                this.total_showtimes = data.total_showtimes;
                this.total_theatres = data.total_theatres;
                this.total_users = data.total_users;
                this.total_bookings = data.total_bookings;
                this.total_reviews = data.total_reviews;
                this.total_revenue = data.total_revenue;
                this.average_movie_rating = data.average_movie_rating;
                this.most_popular_movie = data.most_popular_movie;
                this.user_activity = data.user_activity;
                this.movie_release_trends = data.movie_release_trends;
                this.pieChartUrl = data.pie_chart_url;
                this.topMoviesUrl = data.top_movies_url;
                this.bookingTrendUrl = data.booking_trend_url;
                this.releaseTrendUrl = data.release_trend_url;
            } catch (error) {
                console.error('Error fetching statistics:', error);
                this.errorMessage = 'There was a problem loading the statistics. Please try again later.';
            }
        }
    }
};

const Users = {
    template: `
        <div>
            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-gray-800 text-white">
                    <tr class="text-left text-sm">
                        <th class="py-3 px-4 uppercase font-semibold">Username</th>
                        <th class="py-3 px-4 uppercase font-semibold">Email</th>
                        <th class="py-3 px-4 uppercase font-semibold">Password</th>
                        <th class="py-3 px-4 uppercase font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr v-for="user in users" :key="user.id">
                        <td class="py-3 px-4">{{ user.username }}</td>
                        <td class="py-3 px-4">{{ user.email }}</td>
                        <td class="py-3 px-4">{{ user.password }}</td>
                        <td class="py-3 px-4">
                            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                                Delete
                            </button>

                            
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data() {
        return {
            users: []
        }
    },
    mounted() {
        fetch('/api/getusers')
        .then(response=>response.json())
        .then(data=>{
            this.users = data;
        })
    },
    methods: {
        deleteSponsor(id) {
            alert('Delete sponsor with ID: ' + id);
        }
    }
};

const Movies = {
    template: `
        <div class="">
            <button @click="setcondition(1)" class="bg-black text-white hover:text-black hover:bg-white rounded-lg px-2 py-1 mb-2 -mt-8">+ ADD</button>
            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-gray-800 text-white">
                    <tr class="text-left text-sm">
                        <th class="py-3 px-4 uppercase font-semibold">Title</th>
                        <th class="py-3 px-4 uppercase font-semibold">Description</th>
                        <th class="py-3 px-4 uppercase font-semibold">Release Date</th>
                        <th class="py-3 px-4 uppercase font-semibold">Duration</th>
                        <th class="py-3 px-4 uppercase font-semibold">Genre</th>
                        <th class="py-3 px-4 uppercase font-semibold">Rating</th>
                        <th class="py-3 px-4 uppercase font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr v-for="movie in movies" :key="movie.id">
                        <td class="py-3 px-4">{{ movie.title }}</td>
                        <td class="py-3 px-4">{{ movie.description }}</td>
                        <td class="py-3 px-4">{{ movie.release_date }}</td>
                        <td class="py-3 px-4">{{ movie.duration }}</td>
                        <td class="py-3 px-4">{{ movie.genre }}</td>
                        <td class="py-3 px-4">{{ movie.rating }}</td>
                        <td class="py-3 px-4">
                            <button @click="delete_movie(movie.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                                Delete
                            </button>
                            <button @click="edit_movie(movie.id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
                                Edit
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data() {
        return {
            movies: [],
        }
    },
    mounted() {
        fetch('/api/getmovies')
        .then(response => response.json())
        .then(data =>{
            this.movies = data;
        })
    },
    methods: {
        setcondition(val){
            this.$store.commit('setcondition',val)
        },
        delete_movie(id){
            const formData = new FormData();
            formData.append('id',id)
            fetch('/api/delmovie',{
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data =>{
                if(data.success){
                    this.movies = this.movies.filter(movie => movie.id !== id);
                    alert('Deleted Showtime Successfully!');
                    
                }else{
                    alert("deleting errror");
                }
            })

        },
        edit_movie(id){
            let movie_id = id
            for (let i = 0; i < this.movies.length; i++) {
                if(this.movies[i]['id']===movie_id){
                    let releaseDate = new Date(this.movies[i]['release_date']);
                    let release_date_str = releaseDate.toISOString().split('T')[0];  
                    this.movies[i]['release_date'] = release_date_str;
                    this.setMovieInfo(this.movies[i]);
                    alert('All set');
                    this.setcondition(4);
                }
            }
        },
        setMovieInfo(val){
            this.$store.commit('setMovieInfo',val)
        }
    }
};

const Theatres = {
    template: `
        <div>
            <button @click="setcondition(2)" class="bg-black text-white hover:text-black hover:bg-white rounded-lg px-2 py-1 mb-2 -mt-8">+ ADD</button>
            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-gray-800 text-white">
                    <tr class="text-left text-sm">
                        <th class="py-3 px-4 uppercase font-semibold">Name</th>
                        <th class="py-3 px-4 uppercase font-semibold">Location</th>
                        <th class="py-3 px-4 uppercase font-semibold">Capacity</th>
                        <th class="py-3 px-4 uppercase font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr v-for="theatre in theatres" :key="theatre.id">
                        <td class="py-3 px-4">{{ theatre.name }}</td>
                        <td class="py-3 px-4">{{ theatre.location }}</td>
                        <td class="py-3 px-4">{{ parsedCapacity(theatre.capacity) }}</td>
                        <td class="py-3 px-4">
                            <button @click="delete_theatre(theatre.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                                Delete
                            </button>
                            <button @click="edit_theatre(theatre.id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
                                Edit
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data() {
        return {
            theatres: []
        }
    },
    mounted() {
        fetch('/api/gettheatres')
        .then(response => response.json())
        .then(data =>{
            this.theatres = data;
        })
    },
    methods: {
        setcondition(value){
            this.$store.commit('setcondition',value)
        },
        
        delete_theatre(id){
            const formData=new FormData();
            formData.append('id',id)
            fetch('/api/deltheatre',{
                    method:'POST',
                    body:formData
                })
            .then(response=>response.json())
            .then(data=>{
                if(data.success){
                    alert('Deleted Theatre Successfully!')
                    this.theatres = this.theatres.filter(theatre => theatre.id !== id);
                }else{
                    alert('Deleting Error!')
                }
            })
        },
        edit_theatre(id){
            let theatre_id = id
            for(let i = 0; i < this.theatres.length; i++){
                if(this.theatres[i]['id']===theatre_id){
                    this.setTheatreInfo(this.theatres[i])
                    alert('All Set')
                    this.setcondition(5);
                }
            }
        },
        setTheatreInfo(val){
            this.$store.commit('setTheatreInfo',val);
        },
        parsedCapacity(capacity) {
            // If capacity is a JSON string, parse it; otherwise return the original value
            try {
                return JSON.parse(capacity).join(', ');  // Display the seat availability or details as a string
            } catch (error) {
                return capacity;  // If not parsable, return the raw capacity
            }
        }
    }
};

const Showtimes = {
    template: `
        <div>
            <button @click="setcondition(3)" class="bg-black text-white hover:text-black hover:bg-white rounded-lg px-2 py-1 mb-2 -mt-8">+ ADD</button>
            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-gray-800 text-white">
                    <tr class="text-left text-sm">
                        <th class="py-3 px-4 uppercase font-semibold">Movie Name</th>
                        <th class="py-3 px-4 uppercase font-semibold">Theatre Name</th>
                        <th class="py-3 px-4 uppercase font-semibold">Showtimes</th>
                        <th class="py-3 px-4 uppercase font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr v-for="showtime in showtimes" :key="showtime.id">
                        <td class="py-3 px-4">{{ showtime.movie_id }}</td>
                        <td class="py-3 px-4">{{ showtime.theatre_id }}</td>
                        <td class="py-3 px-4">{{ showtime.showtime }}</td>
                        <td class="py-3 px-4">
                            <button @click="delete_showtime(showtime.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                                Delete
                            </button>

                            <button @click="edit_showtime(showtime.id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
                                Edit
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data() {
        return {
            showtimes: []
        }
    },
    mounted() {
        fetch('/api/getshowtimes')
        .then(response => response.json())
        .then(data =>{
            this.showtimes = data;
        })
    },
    methods: {
        setcondition(val){
            this.$store.commit('setcondition',val)
        },
        delete_showtime(id) {
            const formData = new FormData();
            formData.append('id', id);
            fetch('/api/delshowtime', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.showtimes = this.showtimes.filter(showtime => showtime.id !== id);
                    alert('Deleted Showtime Successfully!');
                } else {
                    alert('Deleting Error!');
                }
            });
        },
        edit_showtime(id) {
            let showtime_id = id;
            for (let i = 0; i < this.showtimes.length; i++) {
                if (this.showtimes[i]['id'] === showtime_id) {
                    let showtime_date = new Date(this.showtimes[i]['showtime']);
                    let datePart = showtime_date.toISOString().split('T')[0];
                    let timePart = showtime_date.toISOString().split('T')[1].substring(0, 5);
                    let showtime_date_str = `${datePart}T${timePart}`;
                    this.showtimes[i]['showtime'] = showtime_date_str;
                    this.setShowtimeInfo(this.showtimes[i]);
                    alert('All Set');
                    this.setcondition(6);
                }
            }
        },        
        setShowtimeInfo(val){
            this.$store.commit('setShowtimeInfo',val);
        }
    }
};

const Bookings = {
    template: `
        <div>
            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-gray-800 text-white">
                    <tr class="text-left text-sm">
                        <th class="py-3 px-4 uppercase font-semibold">User Id</th>
                        <th class="py-3 px-4 uppercase font-semibold">Showtime Id</th>
                        <th class="py-3 px-4 uppercase font-semibold">Seats</th>
                        <th class="py-3 px-4 uppercase font-semibold">Total Price</th>
                        <th class="py-3 px-4 uppercase font-semibold">Booking Date</th>
                        <th class="py-3 px-4 uppercase font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr v-for="booking in bookings" :key="booking.id">
                        <td class="py-3 px-4">{{ booking.user_id }}</td>
                        <td class="py-3 px-4">{{ booking.showtime_id }}</td>
                        <td class="py-3 px-4">{{ booking.seats }}</td>
                        <td class="py-3 px-4">{{ booking.total_price }}</td>
                        <td class="py-3 px-4">{{ booking.booking_date }}</td>
                        <td class="py-3 px-4">
                            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data() {
        return {
            bookings: []
        }
    },
    mounted() {
        fetch('/api/getbookings')
        .then(response => response.json())
        .then(data => {
            this.bookings = data;
        });
    },
    methods: {

    }
};

const Reviews = {
    template: `
        <div>
            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-gray-800 text-white">
                    <tr class="text-left text-sm">
                        <th class="py-3 px-4 uppercase font-semibold">Movie Name</th>
                        <th class="py-3 px-4 uppercase font-semibold">Industry</th>
                        <th class="py-3 px-4 uppercase font-semibold">Budget</th>
                        <th class="py-3 px-4 uppercase font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr v-for="sponsor in sponsors" :key="sponsor.id">
                        <td class="py-3 px-4">{{ sponsor.company_name }}</td>
                        <td class="py-3 px-4">{{ sponsor.industry }}</td>
                        <td class="py-3 px-4">{{ sponsor.budget }}</td>
                        <td class="py-3 px-4">
                            <button v-if="sponsor.approval === 0" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                                <a :href="'/approve/' + sponsor.id">Approve</a>
                            </button>

                            <button v-else class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
                                Approved!
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data() {
        return {
            sponsors: []
        }
    },
    mounted() {
        // fetch('/api/sponsors')
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data);
        //         this.sponsors = data;
        //     });
    },
    methods: {
        deleteSponsor(id) {
            alert('Delete sponsor with ID: ' + id);
        }
    }
};

const App = {
    template: `
        <div>
            <nav class="px-4 py-10 text-xl bg-gradient-to-l from-slate-600">
                <ul class="flex space-x-4 text-white justify-center">
                    <li class="cursor-pointer text-2xl">{{ $store.state.title }}</li>
                    <li class="ml-20">
                        <button v-if="$store.state.stoken === 1" @click="setSToken(2)" class="px-3 rounded-xl py-2 bg-black text-white hover:bg-white hover:text-black">Sign-up</button>
                        <button v-else @click="setSToken(1)" class="px-3 rounded-xl py-2 bg-black text-white hover:bg-white hover:text-black">Log-in</button>
                    </li>
                </ul>
            </nav>
            
            <!-- Sign-Up Form -->
            <div v-if="$store.state.stoken === 2" class="container mx-auto w-[700px] mt-4 bg-gradient-to-r from-red-400 rounded-lg px-4 py-6">
                <div class="flex space-x-4 text-white justify-between">
                    <button class="cursor-pointer text-2xl">Sign-up</button>
                </div>
                <div class="mt-6 flex flex-col items-center">
                    <label for="Username" class="text-white text-xl mb-2">Username:</label>
                    <input v-model="user.username" type="text" class="rounded-lg w-full px-4 py-2" required>
                </div>
                <div class="mt-6 flex flex-col items-center">
                    <label for="Email" class="text-white text-xl mb-2">Email:</label>
                    <input v-model="user.uemail" type="email" class="rounded-lg w-full px-4 py-2" required>
                </div>
                <div class="mt-6 flex flex-col items-center">
                    <label for="Password" class="text-white text-xl mb-2">Password:</label>
                    <input v-model="user.upassword" type="password" class="rounded-lg w-full px-4 py-2" required>
                </div>
                <button @click="signupfunc" class="px-2 py-2 ml-[300px] rounded-lg text-white bg-black hover:text-black hover:bg-white mt-4 text-lg">Sign-up</button>
            </div>

            <!-- Log-In Form -->
            <div v-else class="container mx-auto w-[700px] mt-4 bg-gradient-to-r from-red-400 rounded-lg px-4 py-6">
                <div class="flex space-x-4 text-white justify-between">
                    <button @click='setLToken(1)' class="cursor-pointer text-2xl">Login</button>
                    <button @click='setLToken(0)' class="cursor-pointer text-2xl">Admin Login</button>
                </div>
                <div class="mt-6 flex flex-col items-center">
                    <label for="Username" v-if="$store.state.ltoken === 1" class="text-white text-xl mb-2">Email:</label>
                    <label for="Username" v-else class="text-white text-xl mb-2">ADMIN Email:</label>
                    <input v-model="email" type="text" class="rounded-lg w-full px-4 py-2" required>
                </div>
                <div class="mt-6 flex flex-col items-center">
                    <label for="Password" v-if="$store.state.ltoken === 1" class="text-white text-xl mb-2">Password:</label>
                    <label for="Password" v-else class="text-white text-xl mb-2">ADMIN Password:</label>
                    <input v-model="password" type="password" class="rounded-lg w-full px-4 py-2" required>
                </div>
                <button @click="loginfunc" class="px-2 py-2 ml-[300px] rounded-lg text-white bg-black hover:text-black hover:bg-white mt-4 text-lg">Log-in</button>
            </div>
        </div>
    `,
    data() {
        return {
            user:{
                username: "",
                uemail: "",
                upassword: ""
            },
            email: "",
            password: "",
            users:[]
        }
    },
    mounted(){
        fetch('/api/getusers')
        .then(response=>response.json())
        .then(data=>{
            this.users = data;
        })
    },
    methods: {
        setLToken(value) {
            this.$store.commit('setLToken', value);
        },
        setSToken(value) {
            this.$store.commit('setSToken', value);
        },
        loginfunc() {
            console.log(this.users)
            if (this.$store.state.ltoken===0 && this.email === "admin@gmail.com" && this.password === "2004") {
                this.$router.push('/admin/dashboard');
            } else if (this.$store.state.ltoken===1 && this.email && this.password && this.email!=="admin@gmail.com") {
                let turn = 0;
                for(let i=0;i<this.users.length;i++){
                    // console.log(this.users[i].email)
                    if(this.users[i].email===this.email && this.users[i].password === this.password){
                        turn = 1;
                        break;
                    }                   
                }
                if(turn===1){
                    localStorage.setItem('User_name',this.email);
                    localStorage.setItem('User_password',this.password);
                    this.$router.push('/main/ticketmovies');
                }else{
                    alert("You are not authorized!!")
                }
            } else if (this.email === "" || this.password === "") {
                alert("All Fields are required!!")
            } else {
                alert('Incorrect email or password. Please try again.');
            }
        },
        signupfunc() {
            if(this.user.username==="" || this.user.uemail==="" || this.user.upassword==="" ){
                return alert("All Fields are required!!")
            }
            const formData = new FormData();
            formData.append('username',this.user.username)
            formData.append('uemail',this.user.uemail)
            formData.append('upassword',this.user.upassword)
            fetch('/api/postusers',{
                method: "POST",
                body: formData
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.success){
                    this.user.username='';
                    this.user.uemail='';
                    this.user.upassword='';
                    this.setSToken(1);
                }else{
                    alert('Something Went Wrong!!!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            alert("You are ready to Login!")
        }
    }
};

const MainApp = {
    template: 
        `
        <div>
            <nav class="px-4 py-6 text-xl bg-slate-300 bg-gradient-to-r from-teal-200 to-lime-200">
                <ul class="flex space-x-4 text-red-400">
                    <li class="cursor-pointer">{{title}}</li>
                    <li><input type="text" class="rounded-lg ml-6 mt-1"></li>
                    <li class="cursor-pointer">Search</li>
                    <li>
                        <button class="rounded-lg px-2 bg-white hover:text-white font-bold hover:font-bold hover:bg-black active:bg-gray-800 ring-5 ring-black outline-none focus:outline-none focus:ring focus:ring-white">
                            <router-link to="/" ><button @click="logout">Log-out</button></router-link>
                        </button>
                    </li>
                </ul>
            </nav>
            <nav class="px-4 py-2 bg-red-400 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <div class="flex items-center justify-between">
                    <ul class="flex space-x-4 text-white">
                        <button @click="set_main_app_condition(0,0)"><router-link to="/main/ticketmovies" class="cursor-pointer">Movies</router-link></button>
                        <button @click="set_main_app_condition(0,0)"><router-link to="/main/tickettheatres" class="cursor-pointer">Theatres</router-link></button>
                        <router-link to="" class="cursor-pointer">Activities</router-link>
                    </ul>
                    <ul class="flex space-x-4 text-white text-sm">
                        <router-link to="" class="cursor-pointer">Listyourshow</router-link>
                        <router-link to="" class="cursor-pointer">Offers</router-link>
                    </ul>
                </div>
            </nav>
        
            <div v-if="this.$store.state.main_app_condition===0" class="container mx-auto mt-8 p-4 flex space-x-6">
                <div class="mt-6">
                    <h2 class="text-3xl font-bold text-gray-800 mb-6">Filters</h2>
                    <div class="bg-white py-2 space-y-5 w-56 rounded-sm flex flex-col items-center">
                        <div class="flex space-x-2"><h2 class=" font-sans">Language:</h2><button><img src="/static/down-arrow-svgrepo-com.svg" class="w-3 h-3" alt=""></button></div>
                            <hr class="w-full border-gray-300">
                        <div class="flex space-x-2"><h2 class=" font-sans">Genre:</h2><button><img src="/static/down-arrow-svgrepo-com.svg" class="w-3 h-3" alt=""></button></div>
                            <hr class="w-full border-gray-300">
                        <div class="flex space-x-2"><h2 class=" font-sans">Theatre:</h2><button><img src="/static/down-arrow-svgrepo-com.svg" class="w-3 h-3" alt=""></button></div>
                    </div>
                </div>
                <router-view></router-view>
            </div>
            <div v-else-if="this.$store.state.main_app_condition===1">
                <div class="flex space-x-8  w-full py-10 bg-gradient-to-l from-gray-900 from-30%">
                    <div class="ml-[100px]">
                        <img src="/static/uploads/2322511.webp" class="w-88 h-72 rounded-lg" alt="">
                    </div>
                    <div class="w-96">
                        <p class="text-5xl shadow-sm font-bold text-white"> {{$store.state.movies_list[0].title}} <button class="text-xl bg-black px-2 py-1 rounded-lg" @click="set_main_app_condition(0,0)">Go back</button></p>
                        <div class="w-full bg-gray-600 mt-2 flex justify-between rounded-lg px-3 py-3 font-bold text-white">
                            <p class="text-red-300">
                                &#x2605; <p class="ml-[-85px]">{{$store.state.movies_list[0].rating}}/10</p>
                            </p> 
                            <button @click="show" class="rounded-lg px-2 py-1 text-black bg-white mr-10">Rate Now</button>
                        </div>
                        <div class="flex space-x-2 mt-4">
                            <div class="bg-white px-2 py-1 rounded-sm">
                                2D
                            </div>
                            <div class="bg-white px-2 py-1 rounded-sm">
                                Hindi
                            </div>
                        </div>
                        <p class="text-white mt-4">{{$store.state.movies_list[0].duration}} Hour • {{$store.state.movies_list[0].genre}} • UA • {{$store.state.movies_list[0].release_date}}</p>
                        <button @click="set_main_app_condition(2, $store.state.movies_list[0].id)" class="bg-red-500 mt-8 w-52 text-white rounded-lg px-4 py-3 font-semibold">Book Tickets</button>
                    </div>
                </div>
                <div class="bg-white w-full">
                    <div class="container mx-auto py-10">
                        <p class="text-2xl font-bold">About the movie</p>
                        <p class="mt-4 mb-5">{{$store.state.movies_list[0].description}}</p>
                        <hr>
                        <p class="text-2xl font-bold mt-4">Top reviews</p>
                        
                    </div>
                </div>
                <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 class="text-2xl font-semibold mb-4">{{ $store.state.movies_list[0].title }} - Rate it</h2>
                        <button @click="giveRate(1)" class="text-2xl hover:text-red-600">&#9734;<br>1</button>
                        <button @click="giveRate(2)" class="text-2xl hover:text-red-600">&#9734;<br>2</button>
                        <button @click="giveRate(3)" class="text-2xl hover:text-red-600">&#9734;<br>3</button>
                        <button @click="giveRate(4)" class="text-2xl hover:text-red-600">&#9734;<br>4</button>
                        <button @click="giveRate(5)" class="text-2xl hover:text-red-600">&#9734;<br>5</button>
                        <button @click="giveRate(6)" class="text-2xl hover:text-red-600">&#9734;<br>6</button>
                        <button @click="giveRate(7)" class="text-2xl hover:text-red-600">&#9734;<br>7</button>
                        <button @click="giveRate(8)" class="text-2xl hover:text-red-600">&#9734;<br>8</button>
                        <button @click="giveRate(9)" class="text-2xl hover:text-red-600">&#9734;<br>9</button>
                        <button @click="giveRate(10)" class="text-2xl hover:text-red-600">&#9734;<br>10</button>
                        <br>
                        <button @click="closeModal" class="mt-4 bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded">Close</button>
                    </div>
                </div>
            </div>
            <div v-else-if="this.$store.state.main_app_condition===2">
                <div class="flex space-x-8 w-full py-4 bg-white">
                    <div class="w-96 ml-[100px]">
                        <button @click="set_main_app_condition(1,$store.state.movies_list[0].id)" ><p class="text-5xl font-sans hover:underline cursor-pointer">{{$store.state.movies_list[0].title}} - Hindi</p></button>
                        
                        <div class="flex space-x-2 mt-4 mb-3">
                            <div class="bg-white px-2 py-1 text-slate-500 border border-slate-500 rounded-lg">
                                2D
                            </div>
                            <div class="bg-white px-2 py-1 text-slate-500 border border-slate-500 rounded-lg">
                                Hindi
                            </div>
                            <div @click="set_main_app_condition(1,$store.state.movies_list[0].id)" class="bg-white hover:bg-slate-500 hover:text-white px-2 py-1 text-slate-500 cursor-pointer border border-slate-500 rounded-lg">
                                Go back
                            </div>
                        </div>
                        <hr class="w-full">
                        <div class="bg-white text-black h-14 w-full justify-between flex space-x-2">
                            <button class="text-2xl">&larr;</button>
                            <div class="text-center mt-2 px-2 py-2 ml-4 text-slate-600 flex text-xs flex-col space-y-[-5px] hover:text-red-400 cursor-pointer">
                                <p class="">TUE</p>
                                <p class="text-lg font-normal ">10</p>
                                <p class="">SEP</p>
                            </div>
                            <div class="text-center mt-2 px-2 py-2 ml-4 text-slate-600 flex text-xs flex-col space-y-[-5px] hover:text-red-400 cursor-pointer">
                                <p class="">TUE</p>
                                <p class="text-lg font-normal ">10</p>
                                <p class="">SEP</p>
                            </div>
                            <div class="text-center mt-2 px-2 py-2 ml-4 text-slate-600 flex text-xs flex-col space-y-[-5px] hover:text-red-400 cursor-pointer">
                                <p class="">TUE</p>
                                <p class="text-lg font-normal ">10</p>
                                <p class="">SEP</p>
                            </div>
                            <div class="text-center mt-2 px-2 py-2 ml-4 text-slate-600 flex text-xs flex-col space-y-[-5px] hover:text-red-400 cursor-pointer">
                                <p class="">TUE</p>
                                <p class="text-lg font-normal ">10</p>
                                <p class="">SEP</p>
                            </div>
                            <div class="text-center mt-2 px-2 py-2 ml-4 text-slate-600 flex text-xs flex-col space-y-[-5px] hover:text-red-400 cursor-pointer">
                                <p class="">TUE</p>
                                <p class="text-lg font-normal ">10</p>
                                <p class="">SEP</p>
                            </div>
                            <button class="text-2xl">&rarr;</button>
                        </div>
                    </div>
                </div>
                <div class=" w-full py-10 bg-slate-200 ">
                    <div class="ml-[100px] bg-white h-fit container mx-auto rounded-lg">
                        <div class="flex justify-end px-4 py-1">
                            Available
                        </div>
                        <div v-for="(theatre, index) in uniqueTheatreShowtimes" :key="index" class="theatre-group">
                            <div class="py-4 px-6 flex space-x-2">
                                <!-- Heart icon -->
                                <p class="text-black text-lg hover:text-red-400 cursor-pointer">&heartsuit;</p>

                                <!-- Theatre name -->
                                <p class="text-sm cursor-pointer hover:underline">{{ theatre.theatreName }}, Jaipur</p>

                                <!-- Info label -->
                                <p class="text-slate-500 ml-40 text-xs font-normal mt-1">INFO</p>

                                <!-- Showtimes -->
                                <div @click="set_main_app_condition(3,$store.state.movies_list[0].id);taking_theatre(theatre.theatreName,time);" v-for="(time, tIndex) in theatre.times" :key="tIndex" class="cursor-pointer text-green-400 hover:bg-green-400 hover:text-white border border-slate-500 px-2 py-2 rounded-lg">
                                {{ time }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="this.$store.state.main_app_condition === 3" class="w-full mt-[-120px] h-screen flex flex-col">
                <!-- Top Bar -->
                <div class="flex space-x-8 w-full py-4 bg-white">
                    <div class="w-96 ml-[10px] space-x-2">
                        <button @click="set_main_app_condition(2,$store.state.movies_list[0].id)" class="text-2xl">&larr;</button>
                        <button @click="set_main_app_condition(1,$store.state.movies_list[0].id)">
                            <p class="text-sm font-normal font-sans cursor-pointer">{{$store.state.movies_list[0].title}} - Hindi</p>
                        </button>
                        <button class="absolute top-0 right-0 h-16 w-16" @click="set_main_app_condition(2,$store.state.movies_list[0].id)">&#10060;</button>
                    </div>
                </div>
                
                <!-- Showtimes Section -->
                <div class="w-full py-2 bg-slate-100 flex-grow">
                    <div class="ml-[10px] bg-slate-100 rounded-lg">
                        <div v-for="(theatre, index) in uniqueTheatreShowtimes" :key="index">
                            <div class="px-6 ml-10 flex space-x-2">
                                <div v-for="(time, tIndex) in theatre.times" :key="tIndex">
                                    <div @click="set_main_app_condition(3,$store.state.movies_list[0].id);taking_theatre(theatre.theatreName,time);" v-if="isMatchingTheatre(theatre.theatreName,time)" :class="{'cursor-pointer text-green-400 border border-green-500 px-2 py-2 rounded-sm hover:bg-green-500 hover:text-white': true,
                                    'bg-green-500 text-white' : ismatchingTime(time)}">
                                        {{ time }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr>

                <!-- Diamond, Gold, Silver Sections -->
                <div class="space-x-8 w-full h-fit py-4 bg-white mb-20 flex-grow">
                    <div class="container mx-auto flex flex-col justify-center items-center">
                        <!-- Diamond Section -->
                        <div class="text-slate-500 font-sans text-sm size-9/12">
                            Diamond -/200 Ruppees Only
                            <hr class="mb-4 mt-2">
                            <div class="container mx-auto flex flex-wrap justify-center items-center">
                                <div v-for="n in 20" 
                                    :key="n" 
                                    @click="setSelectedDiamond(n)"
                                    :class="[' ', selected_diamond === n ? ' bg-green-500 text-white ' : ' hover:bg-green-500 hover:text-white ']"
                                    :class="['ml-4 py-1 w-[9%] cursor-pointer border flex justify-center items-center mb-2', 
                                        isSeatBooked(n) ? 'bg-black text-white border-black' : 'text-green-500 border-green-500 hover:bg-green-500 hover:text-white']">
                                    <button>{{ n }}</button>
                                </div>
                            </div>
                        </div>

                        <!-- Gold Section -->
                        <div class="text-slate-500 font-sans text-sm size-7/12">
                            Gold -/200 Ruppees Only
                            <hr class="mb-4 mt-2">
                            <div class="container mx-auto flex flex-wrap justify-center items-center">
                                <div v-for="n in Array.from({ length: 20 }, (v, i) => i + 21)" 
                                    :key="n" @click="setSelectedGold(n)" 
                                    :class="[' ', selected_gold === n ? ' bg-green-500 text-white ' : ' hover:bg-green-500 hover:text-white ']"
                                    :class="['ml-4 py-1 w-[9%] cursor-pointer border flex justify-center items-center mb-2', 
                                    isSeatBooked(n) ? 'bg-black text-white border-black' : 'text-green-500 border-green-500 hover:bg-green-500 hover:text-white']"
                                    :disabled="isSeatBooked(n)"
                                    >
                                    <button>{{ n }}</button>
                                </div>
                            </div>
                        </div>

                        <!-- Silver Section -->
                        <div class="text-slate-500 font-sans text-sm size-5/12">
                            Silver -/200 Ruppees Only
                            <hr class="mb-4 mt-2">
                            <div class="container mx-auto flex flex-wrap justify-center items-center">
                                <div v-for="n in Array.from({ length: 20 }, (v, i) => i + 41)" 
                                    :key="n" @click="setSelectedSilver(n)"
                                    :class="[
                                        'ml-4 py-1 w-[9%] cursor-pointer border flex justify-center items-center mb-2', 
                                        isSeatBooked(n) ? 'bg-black text-white border-black' : (selected_silver === n ? 'bg-green-500 text-white' : 'text-green-500 border-green-500 hover:bg-green-500 hover:text-white')
                                    ]">
                                    <button>{{ n }}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Expanded Modal at the Bottom -->
                <div v-if="showBooks" class="fixed bottom-0 inset-x-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div class="bg-pink-100 p-2 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
                        <button class="text-2xl font-semibold absolute top-0 right-0 h-16 w-16" @click="closeModalBookings">&#10060;</button>
                        <br>
                        <button @click="bookTickets" class="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded mt-4">Book Tickets</button>
                    </div>
                </div>

                <!-- PopUp Modal in the Middle -->
                <div v-if="showBookingPrice" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <p>This is the price of this movie: A steal at just 200!
                        For only 200, you can experience this incredible film. It's worth every penny.</p>
                        <button @click="closeBooking" class="mt-4 bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded">Close</button>
                        <button @click="bookIt" class="mt-4 bg-green-500 hover:bg-green-800 text-white px-4 py-2 ml-56 rounded">Confirm</button>
                    </div>
                </div>
            </div>


        </div>
        `,
    data(){
        return{
            title: "TicketMyShow",
            stateMovieId: 0,
            main_app_movie_list: [],
            showModal:false,
            selected_gold: localStorage.getItem('selected_gold') ? Number(localStorage.getItem('selected_gold')) : null ,
            selected_silver: localStorage.getItem('selected_silver') ? Number(localStorage.getItem('selected_silver')) : null ,
            selected_diamond: localStorage.getItem('selected_diamond') ? Number(localStorage.getItem('selected_diamond')) : null ,
            theatre_storage_Item:null,
            theatre_storage_Item_Time:null,
            showBooks:false,
            showBookingPrice:false,
            theat_detail:[],

        }
    },
    computed: {
        uniqueTheatreShowtimes() {
          const showtimes = this.$store.state.movies_list[0].showtimes;
          const theatreMap = new Map();
      
          showtimes.forEach(showtime => {
            const theatreName = showtime.theatre_id; // or use `showtime.theatre.name`
            if (!theatreMap.has(theatreName)) {
              theatreMap.set(theatreName, []);
            }
            theatreMap.get(theatreName).push(showtime.showtime); // push only the showtime
          });
      
          return Array.from(theatreMap.entries()).map(([theatreName, times]) => ({
            theatreName,
            times
          }));
        }
      },
    methods: {
        logout(){
            console.log("Hello")
            localStorage.removeItem('User_name')
            localStorage.removeItem('User_password')
        },
        set_main_app_condition(val1, val2) {
            if(val2===0){
                localStorage.removeItem('some_random_key_three')
            }
            if(localStorage.getItem('Theatre_name') && localStorage.getItem('Theatre_time') && val1===2){
                localStorage.removeItem('Theatre_name')
                localStorage.removeItem('Theatre_time')
            }
            this.$store.commit('set_main_app_condition', { value1: val1, value2: val2 });
            // this.$forceUpdate();
            
        },
        show(){
            this.showModal = true;
        },
        showBookings(){
            this.showBooks = true;
        },
        closeModal(){
            this.showModal = false;
        },
        closeModalBookings(){
            if(this.selected_diamond){
                localStorage.removeItem('selected_diamond')
                this.selected_diamond = null;
            }
            if(this.selected_gold){
                localStorage.removeItem('selected_gold')
                this.selected_gold = null;
            }
            if(this.selected_silver){
                localStorage.removeItem('selected_silver')
                this.selected_silver = null;
            }
            this.showBooks = false;
            this.$forceUpdate();
        },
        setSelectedDiamond(n) {
            if(this.selected_diamond){
                if(this.selected_diamond===n){
                    this.selected_diamond = null;
                    localStorage.removeItem('selected_diamond')
                    // console.log(this.selected_diamond,this.selected_gold,this.selected_silver)
                    if(this.selected_diamond === null && this.selected_gold === null && this.selected_silver === null){
                        
                    }
                }else{
                    this.selected_diamond = n;
                    localStorage.setItem('selected_diamond',n)
                }
            }else{
                this.selected_diamond = n;
                localStorage.setItem('selected_diamond',n)
            }
            
            this.showBookings()
             // Set the clicked div as selected
        },
        setSelectedGold(n) {
            if(this.selected_gold){
                if(this.selected_gold===n){
                    this.selected_gold = null;
                    localStorage.removeItem('selected_gold')
                    if(this.selected_diamond === null && this.selected_gold === null && this.selected_silver === null){
                        
                    }
                }else{
                    this.selected_gold = n;
                    localStorage.setItem('selected_gold',n)
                }
            }else{
                this.selected_gold = n;
                localStorage.setItem('selected_gold',n)
            }
            this.showBookings()
        },
        setSelectedSilver(n) {
            if(this.selected_silver){
                if(this.selected_silver===n){
                    this.selected_silver = null;
                    localStorage.removeItem('selected_silver')
                    if(this.selected_diamond === null && this.selected_gold === null && this.selected_silver === null){
                        
                    }
                }else{
                    this.selected_silver = n;
                    localStorage.setItem('selected_silver',n)
                }
            }else{
                this.selected_silver = n;
                localStorage.setItem('selected_silver',n)
            }
            this.showBookings()
        },
        taking_theatre(val,val2){
            localStorage.setItem("Theatre_name",val)
            localStorage.setItem("Theatre_time",val2)
            this.$forceUpdate();
        },
        isMatchingTheatre(theatreName, time) {
            return (
              theatreName === this.theatre_storage_Item
            );
        },
        ismatchingTime(time){
            return(
                time === this.theatre_storage_Item_Time
            )
        },
        giveRate(val){
            let uemail = localStorage.getItem("User_name")
            let upassword = localStorage.getItem("User_password")
            let movie_id = localStorage.getItem('some_random_key_two')
            const formData = FormData();
            formData.append('uemail',uemail);
            formData.append('upassword',upassword);
            formData.append('val',val);
            formData.append('movie_id',movie_id);
            fetch('/api/rateMovie',{
                body:formData,
                method:'POST'
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.success){
                    alert("Thank you for rating this movie.")
                }
            })

        },
        showBookingModal(){
            this.showBookingPrice = true;
        },
        closeBooking(){
            this.showBookingPrice = false;
        },
        bookTickets(){
            this.showBookingModal();
        },
        bookIt() {
            let uemail = localStorage.getItem("User_name")
            let upassword = localStorage.getItem("User_password")
            let showtime_time = localStorage.getItem("Theatre_time")
            let theatre_name = localStorage.getItem("Theatre_name")
            let seat_no1 = localStorage.getItem("selected_diamond") ? Number(localStorage.getItem("selected_diamond")) : 0
            let seat_no2 = localStorage.getItem("selected_silver") ? Number(localStorage.getItem("selected_silver")) : 0
            let seat_no3 = localStorage.getItem("selected_gold") ? Number(localStorage.getItem("selected_gold")) : 0
            let price = 200;
            const formData = new FormData();
            formData.append('uemail', uemail)
            formData.append('upassword', upassword)
            formData.append('showtime_time', showtime_time)
            formData.append('theatre_name', theatre_name)
            formData.append('seat_no1', seat_no1)
            formData.append('seat_no2', seat_no2)
            formData.append('seat_no3', seat_no3)
            formData.append('price', price)
        
            fetch('/api/bookMovie', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Get ready for a cinematic adventure! Your movie tickets are confirmed.");
                    this.closeBooking();
        
                    // Fetch updated seat data after booking to reflect changes in UI
                    fetch(`/api/gettheatres?theatre=${theatre_name}`)
                    .then(response => response.json())
                    .then(updatedData => {
                        if (!updatedData.error) {
                            // Update theat_detail with the new capacity to reflect booked seats
                            this.theat_detail = updatedData;
                            this.$forceUpdate();
                        }
                    });
        
                } else {
                    alert("Something Went Wrong!!!");
                }
            });
        },
        isSeatBooked(seatNumber) {
            if (this.theat_detail && this.theat_detail.capacity) {
                return this.theat_detail.capacity[seatNumber - 1] === 1; // Check if the seat is booked
            }
            return false;
        }
        
    },
    beforeMount() {
        
    },
    mounted() {
        this.stateMovieId = localStorage.getItem('some_random_key_two') ? Number(localStorage.getItem('some_random_key_two')) : 0;
        this.main_app_movie_list = localStorage.getItem('some_random_key_three')? JSON.parse(localStorage.getItem('some_random_key_three')) : [];
        this.theatre_storage_Item = localStorage.getItem('Theatre_name') ? localStorage.getItem('Theatre_name') : 'No item Found';
        this.theatre_storage_Item_Time = localStorage.getItem('Theatre_time') ? localStorage.getItem('Theatre_time') : 'No timing';
        // For Theatre:

        if(this.theatre_storage_Item!=='No item Found'){
            let theat = this.theatre_storage_Item;
            fetch(`/api/gettheatres?theatre=${theat}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.errorMessage = data.error;
                } else {
                    this.theat_detail = data;
                }
            })
            .catch(err => {
                this.errorMessage = "Failed to fetch movies.";
            });
        }
        
        
    },
    beforeUpdate(){
        this.theatre_storage_Item = localStorage.getItem('Theatre_name') ? localStorage.getItem('Theatre_name') : 'No item Found';
        this.theatre_storage_Item_Time = localStorage.getItem('Theatre_time') ? localStorage.getItem('Theatre_time') : 'No timing';
        if(localStorage.getItem('selected_silver') || localStorage.getItem('selected_gold') || localStorage.getItem('selected_diamond')){
            this.showBookings();
        }
        if(!localStorage.getItem('selected_silver') && !localStorage.getItem('selected_gold') && !localStorage.getItem('selected_diamond')){
            this.closeModalBookings();
        }
        
    },
    
    
};

const ticketmovies = {
    template: `
        <div>
            <div class="container mx-auto p-4">
                <h2 class="text-4xl font-bold text-gray-800 mb-6">Latest Movies</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div @click="set_main_app_condition(1,movie.id)" v-for="movie in movies" :key="movie.id" class="bg-white p-6 cursor-pointer shadow-lg rounded-sm flex flex-col items-center">
                        <h3 class="text-xl font-semibold text-gray-800">{{movie.title}}</h3>
                        <p class="text-2xl text-gray-700">Release Date: {{ movie.release_date }}</p>
                        <p class="text-2xl text-gray-700">Duration: {{ movie.duration }}</p>
                        <p class="text-2xl text-gray-700">Genre: {{ movie.genre }}</p>
                        <p class="text-2xl text-gray-700">Rating: {{ movie.rating }}</p>
                    </div>
                </div>
                <!-- Optional: Add an error message here if needed -->
                <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
            </div>
            
        </div>
    `,
    data() {
            return {
                movies:[],
                errorMessage:"",
                total_movies: 0,
                showtimes:[],
            }
        },
    beforeMount() {
        fetch('/api/getshowtimes')
        .then(response => response.json())
        .then(data =>{
            this.showtimes = data;
            
        })
        fetch('/api/getmovies')
        .then(response => response.json())
        .then(data =>{
            this.movies = data;
        })
        
        
    },
    mounted() {

    },
    methods: {
        set_main_app_condition(val1, val2) {
            if (val2 !== 0) {
                fetch(`/api/getmovies?movie_id=${val2}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            this.errorMessage = data.error;
                        } else {
                            this.setMovieList(data);
                        }
                    })
                    .catch(err => {
                        this.errorMessage = "Failed to fetch movies.";
                    });
            } else if (val2 === 0) {
                this.setMovieList([]);               // Clear the movie list
                // localStorage.removeItem('some_random_key_three');  // Remove the item from localStorage
            }
            
            this.$store.commit('set_main_app_condition', { value1: val1, value2: val2 });
        },
        setMovieList(val) {
            this.$store.commit('setMovieList', val);
        }
        
    }
};

const tickettheatres = {
    template: `
        <div class="container mx-auto p-4">
            <h2 class="text-4xl font-bold text-gray-800 mb-6">Theatres</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div @click="showmovies(theatre.name)" v-for="theatre in theatres" :key="theatre.id" class="bg-white p-6 cursor-pointer shadow-lg rounded-sm flex flex-col items-center">
                    <h3 class="text-xl font-semibold text-gray-800">{{theatre.name}}</h3>
                    <p class="text-2xl text-gray-700">Location: {{ theatre.location }}</p>
                    <p class="text-2xl text-gray-700">Capacity: {{ parsedCapacity(theatre.capacity) }}</p>
                </div>
            </div>
            <!-- Optional: Add an error message here if needed -->
            <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>

            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 class="text-2xl font-semibold mb-4">{{ selectedTheatre }} - Movies</h2>
                    <ul v-if="movies.length">
                        <li v-for="movie in movies" :key="movie.id" class="mb-2">{{ movie.title }}<button @click="set_main_app_condition(1,movie.id)" class="ml-2 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white px-2 py-1 rounded-lg">Book Tickets</button></li>
                    </ul>
                    <p v-if="!movies.length">No movies available for this theatre.</p>
                    <button @click="closeModal" class="mt-4 bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded">Close</button>
                </div>
            </div>
        </div>
    `,
    data() {
            return {
                theatres:[],
                errorMessage:"",
                total_movies: 0,
                total_showtimes: 0,
                total_theatres: 0,
                total_bookings: 0,
                total_reviews: 0,
                total_revenue: 0,
                average_movie_rating: 0,
                pieChartUrl: '',
                most_popular_movie: '',
                topMoviesUrl: '',
                bookingTrendUrl: '',
                releaseTrendUrl: '',
                movies:[],
                selectedTheatre: '',
                showModal: false,
            }
        },
    mounted() {
        fetch('/api/gettheatres')
        .then(response => response.json())
        .then(data =>{
            this.theatres = data;
        })
    },
    methods: {
        showmovies(name) {
            this.selectedTheatre = name;
            this.showModal = true;
    
            // Fetch movies for the selected theatre
            fetch(`/api/getmovies?theatre=${name}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.errorMessage = data.error;
                } else {
                    this.movies = data;
                }
            })
            .catch(err => {
                this.errorMessage = "Failed to fetch movies.";
            });
        },
        closeModal() {
            this.showModal = false;
            this.movies = [];
        },
        set_main_app_condition(val1, val2) {
            if (val2 !== 0) {
                fetch(`/api/getmovies?movie_id=${val2}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            this.errorMessage = data.error;
                        } else {
                            this.setMovieList(data);
                        }
                    })
                    .catch(err => {
                        this.errorMessage = "Failed to fetch movies.";
                    });
            } else if (val2 === 0) {
                this.setMovieList([]);
            }
            
            this.$store.commit('set_main_app_condition', { value1: val1, value2: val2 });
        },
        setMovieList(val) {
            this.$store.commit('setMovieList', val);
        },
        parsedCapacity(capacity) {
            // If capacity is a JSON string, parse it; otherwise return the original value
            try {
                let js =  JSON.parse(capacity).join(', '); 
                return js.length // Display the seat availability or details as a string
            } catch (error) {
                return capacity.length;  // If not parsable, return the raw capacity
            }
        }
        
    }
};

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: App
        },
        {
            path: '/main',
            component: MainApp,
            children: [
                { path: 'ticketmovies', component: ticketmovies },
                { path: 'tickettheatres', component: tickettheatres }
            ]
        },
        {
            path: '/admin',
            component: AdminDashboard,
            meta: { requiresAdmin: true },
            children: [
                { path: 'dashboard', component: Dashboard },
                { path: 'users', component: Users },
                { path: 'movies', component: Movies },
                { path: 'theatres', component: Theatres },
                { path: 'showtimes', component: Showtimes },
                { path: 'bookings', component: Bookings },
                { path: 'reviews', component: Reviews }
            ]
        },
        { path: '*', redirect: '/' }
    ]
});

new Vue({
    el: '#app',
    data:{
        hi:'Hello'
    },
    router,
    store,
    
});