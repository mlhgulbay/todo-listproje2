const form = document.getElementById("todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearBotton = document.querySelector("#clear-todos");

eventListeners();


function eventListeners(){//bu fonksiyonun görevi tüm event listener ları atamak
        form.addEventListener("submit",addTodo);
        document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
        secondCardBody.addEventListener("click",deleteTodo);
        filter.addEventListener("keyup",filterTodos);    
        clearBotton.addEventListener("click",clearAllTodos);

}
function clearAllTodos(e){
    if(confirm("Tümünü silmek istediğinize emin misiniz?")){//Arayüzden todoları kaldırma
        //yavaş bir yöntem ****todoList.innerHTML = "";
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }
   
        console.log(todoList.firstElementChild);
        localStorage.removeItem("todos");
    }
  
}
function filterTodos(e){
  // console.log(e.target.value);
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    
    listItems.forEach(function(listItem){
        const text = listItems.textContent.toLowerCase();
        if(text.indexOf(filterValue)=== -1){
                //BULAMADI
                listItem.setAttribute("style","display : none !important ");//display:none ;sayfada var ancak göstermiyoruz
        }
        else{
                listItem.setAttribute("style","display : block");
        }
        //yazdığımız kod aslında çalışıyor ancak bootstrap da çalışan d-flex özelliği display a göre baskın geliyor
        //bu yüzden istediğimiz sonucu ekranda göremiyoruz.D-flex in içinde important bir özellik olarak display:block var
      
    });

}
function deleteTodo(e){//silme simgesine basıldığında todo silme işlemi
    if(e.target.className === "fa fa-remove"){
            e.target.parentElement.parentElement.remove();//sadece arayüzden silindi
            showAlert("success","Todo başarıyla silindi...") ;
            deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    }
}
function deleteTodoFromStorage(deletetodo){//silmemiz gereken yer li elementinin textContenti
        let todos = getTodoFromStorage();

        todos.forEach(function(todo,index){
            if(todo === deleteTodo) {
                    todos.splice(index,1);//arraydan değeri silme
            }
        });
        localStorage.setItem ("todos",JSON.stringify(todos));

}
function loadAllTodosToUI(){//sayfa her yenilendiğinde çalışacak olan fonksiyon
    let todos = getTodoFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    })

}
function addTodo(e){
    const newTodo = todoInput.value.trim();//baştaki ve sondaki boşlukları sildik
    if(newTodo ==="" ){
            showAlert("danger","Lütfen bir todo girin...");//(type,message)

    }
    else{
    //     <div class="alert alert-danger" role="alert">
    //     This is a danger alert—check it out!
    //   </div> 
        addTodoToUI(newTodo);//Arayüze Todo yu ekle
        addTodoStorage(newTodo);
        showAlert("success","Todo başarıyla eklendi...")
    }
    
   // console.log(newTodo);
    e.preventDefault();//form ekrardan sayfaya yönlenmesin diye
}
function getTodoFromStorage(){//Storagedan bütün Todoları alacak
    let todos;
    if(localStorage.getItem("todos") === null)//local storage da todos adında bir key var mı diye bakılır 
    //eğer yoksa null döner
    {
            todos = [];//todos key i yoksa boş bir şekilde array başlat

    }
    else{//eğer varsa
        todos = JSON.parse(localStorage.getItem("todos"));

    }
    return todos;
}
function addTodoStorage(newTodo){
    let todos = getTodoFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos))
    //Bir Todo Girin kısmına eklediğim todoları localstorage'ada eklemiş oluyorum 
    // let todos;
    // if(localStorage.getItem("todos") === null)//local storage da todos adında bir key var mı diye bakılır 
    // //eğer yoksa null döner
    // {
    //         todos = [];//todos key i yoksa boş bir şekilde array başlat

    // }
    // else{//eğer varsa
    //     todos = JSON.parse(localStorage.getItem("todos"));

    // }
}
function showAlert(type,message){//bu kısma dinamik element oluşturacağız

    const alert = document.createElement("div");
    
    alert.className = `alert alert-${type}`;

    alert.textContent = message;

    firstCardBody.appendChild(alert);//ekrana uyarı verdik

    //alert.remove();hemen eklenip silinir ancak biz ekranda 2 sn kalsın istiyoruz
    //setTimeOut
    setTimeout(function() {
        alert.remove();
    }, 2000);//2 sn

    //console.log(alert);


}
function addTodoToUI(newTodo){//Aldığı string değerini list item olarak UI'ya ekleyecek.
/* <li class="list-group-item d-flex justify-content-between">
        Todo 1
        <a href = "#" class ="delete-item">
            <i class = "fa fa-remove"></i>
        </a>

    </li>*/
    //list item oluşturma
    const listItem = document.createElement("li");
    //link oluşturma
    const link = document.createElement("a");
    link.href="#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";
    //text node ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);
    //Todo List'e List Item'ı ekleme
    todoList.appendChild(listItem);

    //console.log(listItem);
    todoInput.value = "" ;//bir todo girin alanını her bilgi almadan sonra temizliyoruz
}

