import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var recipes = (typeof localStorage["recipeList"] !== "undefined")?JSON.parse(localStorage["recipeList"]):[
  {index:0, title: "Meatball Rolls", ingredients: ['Meatballs', 'Pasta Sauce', 'Cheese', 'Submarine rolls']}, 
  {index:1, title: "Chicken Pesto", ingredients: ['Chicken breasts', 'Pesto Sauce', 'Provolone Cheese', 'Mushrooms']}, 
  {index:2, title: "Vegetable Lasagna", ingredients: ['Pasta Sauce', 'Lasagna noodles', 'Ricota cheese', 'Vegetables']}
];

localStorage.setItem("recipeList", JSON.stringify(recipes));

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      recipe: this.props.name,
      ingredients: this.props.ingredients
    }
    this.updateRecipe = this.updateRecipe.bind(this);
    this.updateIngredients = this.updateIngredients.bind(this);
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
  }
  edit() {
    this.setState({ editing: true });
  }
  updateRecipe(event) {
    if(event.target.value === ''){
      this.setState({ recipe: this.state.recipe});
    }else {
      this.setState({ recipe: event.target.value });
    }
    this.props.updateRecipe(this.state.recipe,this.props.index);
  }
  updateIngredients(event) {
    const rawIngredients = event.target.value;
    const ingredients = rawIngredients.split(',');
    this.setState({ ingredients: ingredients });
    this.props.updateIngredients(this.state.ingredients,this.props.index);
  }
  save() {
    this.setState({ editing: false });
  }
  renderEdit() {
    return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h1 className="panel-title">
          <a data-toggle="collapse" data-parent="#accordion" href={"#"+this.props.index}>
            <input
              onChange={(event)=>this.updateRecipe(event)}
              defaultValue={this.state.recipe} 
              placeholder="Recipe name">
            </input>
          </a>
        </h1>
      </div>
      <div id={this.props.index} className="panel-collapse collapse in">
        <div className="panel-body">
          <h4>Edit ingredients</h4>
          <textarea 
            onChange={(event)=>this.updateIngredients(event)}
            rows="5" cols="20" defaultValue={this.state.ingredients}
            placeholder="Enter ingredients separated by a comma">
          </textarea>
          <button className="btn btn-info space" onClick={this.save} >Save</button>
        </div>
      </div>
    </div>
    );
  }
  renderNormal() {
    return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h1 className="panel-title">
          <a data-toggle="collapse" data-parent="#accordion" href={"#"+this.props.index}>{this.state.recipe}</a>
        </h1>
      </div>
      <div id={this.props.index} className="panel-collapse collapse">
        <div className="panel-body">
          <h4>Ingredients</h4>
          <ul>
            {this.state.ingredients.map((ingredient,index) => 
              <li key={index}>{ingredient}</li>
            )}
          </ul>
          <button className="btn btn-warning space" onClick={this.edit} >Edit</button>
          <button className="btn btn-danger space" onClick={()=>this.props.removeRecipe(this.props.index)} >Remove</button>
        </div>
      </div>
    </div>
    );
  }
  render() {
    if(!this.state.editing) {
      return this.renderNormal();
    }else {
      return this.renderEdit();
    }
  }
}

class RecipeAdd extends React.Component {
  render() {
    return(
      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Add recipe</h4>
              <input id="newRecipe" placeholder="Recipe name" defaultValue="" />
            </div>
            <div className="modal-body">
              <h5>Add ingredients</h5>
              <textarea id="newIngredients" placeholder="Enter ingredients separated by a comma" defaultValue="" />
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-primary" 
                data-dismiss="modal" 
                onClick={this.props.save} >
                  Save
              </button>
              <button 
                type="button" 
                className="btn btn-default" 
                data-dismiss="modal"
                onClick={this.props.close} >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class RecipeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeList: recipes
    }
    this.updateRecipe = this.updateRecipe.bind(this);
    this.updateIngredients = this.updateIngredients.bind(this);
    this.removeRecipe = this.removeRecipe.bind(this);
    this.save = this.save.bind(this);
    this.close = this.close.bind(this);
  }
  updateRecipe(data, index) {
    recipes[index].title = data;
    localStorage.setItem("recipeList", JSON.stringify(recipes));
    this.setState({ recipeList: recipes});
  }
  updateIngredients(data, index){
    recipes[index].ingredients = data;
    localStorage.setItem("recipeList", JSON.stringify(recipes));
    this.setState({ recipeList: recipes});
  }
  removeRecipe(index) {
    recipes.splice(index, 1);
    localStorage.setItem("recipeList", JSON.stringify(recipes));
    this.setState({ recipeList: recipes });
  }
  save() {
    //var i=0;
    //recipes.map(recipe=> i++);
    const addedRecipe = document.getElementById('newRecipe').value;
    document.getElementById('newRecipe').value = "";
    const rawIngredients = document.getElementById('newIngredients').value;
    document.getElementById('newIngredients').value = "";
    const addedIngredients = rawIngredients.split(',');
    recipes.push({ index: recipes.length+1, title: addedRecipe, ingredients: addedIngredients });
    localStorage.setItem("recipeList", JSON.stringify(recipes));
    this.setState({ recipeList: recipes });
  }
  close() {
    document.getElementById('newRecipe').value = "";
    document.getElementById('newIngredients').value = "";
  }
  render() {
    return(
      <div>
        <div className="center">
          <h1>Recipe-Box</h1>
          <button
            type="button"
            className="btn btn-success"
            data-toggle="modal" 
            data-target="#myModal" >
              Add Recipe
          </button>
          <RecipeAdd 
            save={this.save}
            close={this.close} />
        </div>
        <div className="container">
          <div className="panel-group" id="accordion">
            {(this.state.recipeList).map((recipe,index) =>
              <Recipe 
                key={recipe.index}
                index={index} 
                name={recipe.title}
                ingredients={recipe.ingredients}
                updateRecipe={this.updateRecipe}
                updateIngredients={this.updateIngredients}
                removeRecipe={this.removeRecipe} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<RecipeBox />, document.getElementById('root'));