// elementleri seçerek başlıyoruz
const form = document.querySelector("#todo-form"); // input ve buton'un parent'ına erişiyoruz
const todoInput = document.querySelector("#todo"); // içindeki text'i todo olarak listeye ekleyeceğimiz inputu seçiyoruz
const todoList = document.querySelector(".list-group") // todoların listeleneceği listeyi seçiyoruz
const firstCardBody = document.querySelectorAll(".card-body")[0]; // input ve butonun olduğu 1.cardbody'yi seçiyoruz
const secondCardBody = document.querySelectorAll(".card-body")[1]; //todoların listeleneceği ve silineceği 2.cardbody'yi seçiyoruz
const filter = document.querySelector("#filter"); // todoları filtreleyeceğimiz inputu seçiyoruz
const clearButton = document.querySelector("#clear-todos"); //tüm todoları silecek butonu seçiyoruz

eventListeners(); // burada,tüm eventların toplandığı fonksiyon çalışıyor
function eventListeners() // burası,fonksiyonun içeriği
{
    form.addEventListener("submit", addTodo); // submit (butona basma olayı) gerçekleşirse addTodo fonksiyonu çalışacak
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI); // sayfa yenilendiğindi loadAllTodosToUI fonksiyonu çalışacak,içeriğini aşağıda yazacağız
    secondCardBody.addEventListener("click", deleteTodo);  // click eventinin tetiklediği fonksiyon,içeriğini aşağıda yazacağız
    filter.addEventListener("keyup", filterTodos); // filtre inputuna harf yazılınca filterTodos fonksiyonu çalışacak,içeriğini aşağıda yazacağız

}
function filterTodos(e) // todoları filtreleyecek fonksiyon
{
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item"); //todoları al
    listItems.forEach(function (listItem) // arrayler üzerinde gez 
    {
        const text = listItem.textContent.toLowerCase();  // arrayin textini al,küçük hafe çevir
        if (text.indexOf(filterValue) === -1)  // inputa girilen text,array olarak yoksa index -1 döner
        {
            listItem.setAttribute("style", "display : none !important"); // filtre inputuna yazılan text,array listesinde olmadığı için ekrandan siliyoruz
        }
        else {
            listItem.setAttribute("style", "display : block"); // index -1 değilse,input texti,array listesinde var demektir o zaman text ekranda gözükecek(aradığımız todo ekranda gözükecek)
        }
    })
}
function deleteTodo(e)  // todoları listeden silecek fonksiyon
{
    if (e.target.className === "fa fa-remove")  // secondCardBody de click olan elementin classı "fa fa-remove" ise;
    {
        e.target.parentElement.parentElement.remove(); // x(remove) butonuna basınca içinde bulunduğu li yi siliyor
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "Todo Silindi");
    }
}
function deleteTodoFromStorage(deletetodo) // todoları storagedan silecek fonksiyon
{
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index)  // listeden silinen todoyu storagedan silen döngü
    {
        if (todo === deletetodo) // arraylerde deletetodo'ya rastlarsa..
        {
            todos.splice(index, 1);  // indexten itibaren (index dahil) 1 tane todo silecek --- (remove olmazdı çünkü arrayi silmezdi,text contenti silerdi)
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}
function loadAllTodosToUI() // sayfa yenilendiğinde storagedaki todoları listeleyeceğiz
{
    let todos = getTodosFromStorage();
    todos.forEach(function (todo) // Storagedaki todoları sırayla listele
    {
        addTodoToUI(todo);
    });
}
function addTodo(e) // burası,submit olunca çalışacak fonksiyonun içeriği(ekle butonu)
{
    const newTodo = todoInput.value.trim(); //inputun içindeki stringi al,sağında solunda boşluk varsa sil ve newTodo'ya ata
    if (newTodo === "") // eğer input boşsa showAlert fonksiyonu çalışacak ve kırmızı olarak Bir Toro Giriniz uyarısı verecek
    {
        showAlert("danger", "Bir Todo Giriniz");
    }
    else {
        addTodoToUI(newTodo); // newTodo'yu, bir todo olarak listeye ekleyecek fonksiyonu çalıştırıyoruz,içeriğini aşağıda yazacağız
        addTodoToStorage(newTodo); // newTodo'yu storage'a ekleyecek fonksiyon çalışıyor
        showAlert("success", "Todo Eklendi")
    }

    e.preventDefault();  // sayfanın yenilenmesini engelliyoruz
}
function getTodosFromStorage() //Storagedan todoları çeken fonksiyon
{
    let todos;
    if (localStorage.getItem("todos") === null) // storageda todos arrayi yoksa oluştur
    {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos")); // storageda todos arrayi varsa getir
    }
    return todos;  // todos arrayini döndür
}
function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}
function showAlert(type, message) // 'başarılı,eksik bilgi' gibi mesajları gösterecek fonksiyonun içeriği
{
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;  // class name = aler alert-(gelen type)
    alert.textContent = message;
    firstCardBody.appendChild(alert); // body'e çocuk olarak bir alert ekliyorum
    setTimeout // alert 1 saniye sonra silinecek
        (function () {
            alert.remove();
        }, 1000);
}
function addTodoToUI(newTodo) // todo ekleyen fonksiyonun içeriniğini yazıyoruz
{
    const listItem = document.createElement("li"); // bir list item oluştur ve listItem olarak tanımla
    const link = document.createElement("a"); //  bir a elementi oluşturur,burada mevcut list itemı silmek için bir buton oluşturuluyor
    link.href = "#"; // link veliyor
    link.className = "delete-item"; // butona class name veriliyor
    link.innerHTML = "<i class = 'fa fa-remove'></i>"; // linkin içine,bootstrak sınıfı kullanarak bir silme iconu ekliyoruz

    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);
    todoList.appendChild(listItem);
    todoInput.value = "";
}

