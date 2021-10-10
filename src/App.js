import React,{Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Particles from 'react-particles-js';
import Rank from './components/Rank/Rank.js';


const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};
 
const initialstate ={
  input:'',
  imageUrl: '',
  box: {},
  route:'signin',
  isSignedIn: false,
  user:{
    id: '',
    name:'',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component{
  constructor(){
    super();
    this.state = initialstate
  }

  loadUser = (data) =>{
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }
  })
  }

  calculateFaceLocation = (data)=>{
    const clarifaiFace = data[0];
    console.log(clarifaiFace.top_row)
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width-(clarifaiFace.right_col * width),
      bottomRow: height-(clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange =(event)=>{
    this.setState({input: event.target.value});
  }
  onButtonSubmit =()=>{
    this.setState({imageUrl: this.state.input});
    const imagelink = this.state.input;
    console.log(this.state.imageUrl);
    fetch('http://localhost:3000/facerecognition',{
            method:'post',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify({
                link:imagelink
            })
        }).then(response => {
          fetch('http://localhost:3000/image',{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            }).then(response => response.json())
            .then(count=>{
              this.setState(Object.assign(this.state.user,{entries:count}))
            })
            .catch(console.log)
          })
          response.json()})
        .then(link => this.displayFaceBox(this.calculateFaceLocation(link)))
        .catch(err => console.log(err));
  }
  onRouteChange=(route)=>{
    if(route === 'signout'){
      this.setState(initialstate)
    }
    else if(route ==='home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route:route});
  }
  render(){
    const { isSignedIn,imageUrl,route,box } = this.state;
    const {name, entries} = this.state.user;
    return (
    <div className='App'>
      <Particles className='particles'
      params={particlesOptions}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      {route ==='home'
      ?<div>
      <Logo/>
      <Rank name={name} entries={entries}/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>      
      <FaceRecognition box={box} imageUrl={imageUrl}/>
      </div>:(
        this.state.route === 'signin'?
        <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      )}
    </div>
  );
  }
}

export default App;
