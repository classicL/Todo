function Todo(){
	this.todoList = [];
	this.init();
}
Todo.prototype.init = function(){
	this.todoList = localStorage.todo ? JSON.parse(localStorage.todo) : [];
	this.render();
}
Todo.prototype.addTodo = function(todo){
	this.todoList.push({
		title:todo,
		complete: false
	});
	this.ls();
	this.render();
}
Todo.prototype.removeTodo = function(index){
	this.todoList.splice(index,1);
	this.ls();
	this.render();
}
Todo.prototype.changeContent = function(index,todo){
	this.todoList[index].title = todo;
	this.ls();
	this.render();
}
Todo.prototype.changeStatus = function(index){
	this.todoList[index].complete = !this.todoList[index].complete;
	this.ls();
	this.render();
}
Todo.prototype.ls = function(){
	localStorage.todo = JSON.stringify(this.todoList);
}
Todo.prototype.render = function(filter){
	var _this = this;
	document.querySelector(".main ul").innerHTML = "";
	var frag = document.createDocumentFragment();
	for (var i = 0; i < this.todoList.length; i++) {
		var node = document.createElement("li");
		node.className = "todo-item";
		if(this.todoList[i].complete === true) node.className = "todo-item done";
		node.innerHTML = '<div class="complete-ctrl">✔</div><div class="todo-content">' + this.todoList[i].title + '</div><input type="text" class="todo-change" value="' + this.todoList[i].title + '"><span class="delete">X</span>'
		if(filter){
			if(filter === "act" && this.todoList[i].complete === true) node.style.display = "none";
			if(filter === "done" && this.todoList[i].complete === false) node.style.display = "none";
		}
		frag.appendChild(node);
	}
	this.changeLeft();
	document.querySelector(".main ul").appendChild(frag);
	Array.prototype.forEach.call(document.querySelectorAll(".delete"),function(item){
		item.onclick = function(){
			_this.removeTodo(_this.getIndex(item.parentNode,item.parentNode.parentNode.children));
		}
	})
	Array.prototype.forEach.call(document.querySelectorAll(".complete-ctrl"),function(item){
		item.onclick = function(){
			_this.changeStatus(_this.getIndex(item.parentNode,item.parentNode.parentNode.children));
		}
	})
	Array.prototype.forEach.call(document.querySelectorAll(".todo-content"),function(item){
		item.ondblclick = function(){
			item.parentNode.querySelector(".todo-change").style.display = "block";
			item.parentNode.querySelector(".todo-change").focus();
			item.parentNode.querySelector(".todo-change").onblur = function(){
				console.log()
				_this.changeContent(_this.getIndex(item.parentNode,item.parentNode.parentNode.children),item.parentNode.querySelector(".todo-change").value)
			}
		}
	})
}
Todo.prototype.getIndex = function(sub,sup){
	for (var i = 0; i < sup.length; i++) {
		if(sub === sup[i]) return i;
	}
}
Todo.prototype.changeLeft = function(){
	document.querySelector(".num").innerHTML = this.todoList.length +  " items left";
}

var t = new Todo();
// t.addTodo("a");t.addTodo("B");t.addTodo("c");

document.querySelector(".add-content").onfocus = function(){
	var _this = this;
	window.onkeydown = function(e){
		var e = e || window.event;
		if(e.keyCode === 13){
			var str = _this.value.trim();
			if(str === "") return;
			t.addTodo(_this.value);
			_this.value = "";
		}
	}
}
document.querySelector(".all").onclick = function(){
	t.render();
	this.className = "all selected";
	document.querySelector(".act").className = "act";
	document.querySelector(".com").className = "com";
}
document.querySelector(".act").onclick = function(){
	t.render("act");
	this.className = "act selected";
	document.querySelector(".all").className = "all";
	document.querySelector(".com").className = "com";
}
document.querySelector(".com").onclick = function(){
	t.render("done");
	this.className = "com selected";
	document.querySelector(".all").className = "all";
	document.querySelector(".act").className = "act";
}
document.querySelector(".add-left").onclick = function(){
	if(document.querySelector(".main ul").style.display === "none"){
		document.querySelector(".main ul").style.display = "block";
		this.querySelector("span").className = "";
	}else{
		document.querySelector(".main ul").style.display = "none";
		this.querySelector("span").className = "move";
	}
}
