function write_to_title(type, data){
    var jsObj = {"type":type, "data":data};
    document.title = JSON.stringify(jsObj, "replacer");
}

function home_item_link(link){
    var type = "home_item_link";
    var data = link.id;
    write_to_title(type, data);
}

function external_link(link){
    var type = "external_link";
    var data = link.href;
    write_to_title(type, data);
}

function create_index_img_node(id, img_path){
    var imgObj = document.createElement("img");
    imgObj.src = img_path;
    data_caption = "#"+id;
    imgObj.setAttribute("data-caption", data_caption);
    return imgObj;
}

function create_index_span_content_node(id, content){
    var spanObj = document.createElement("span");
    spanObj.className = "orbit-caption";
    spanObj.id = id;

    var status_img = document.createElement("div");
    status_img.innerHTML = content;
    status_img.className = "read";

    for (var i=0;i<Values[3].length;i++){
        if (Values[3][i] == id){
            status_img.className = "unread";
        }
    }

    spanObj.appendChild(status_img);
    return spanObj;
}

function insert_pages_into_chapter(pages){
    outer = document.getElementById("outer");
    featured = document.getElementById("featured");
    for (var i=0;i < pages.length;i++){
        featured.appendChild(create_index_img_node(pages[i]["id"], pages[i]["image"]));
        outer.appendChild(create_index_span_content_node(pages[i]["id"], pages[i]["description"]));
    }
}

/***
 * Notice: the percent argument is a number between 0.0~1.0 
 * */
function create_home_icon_node(id, book, title, icon_path, percent){ 
   percent_div = document.createElement("div");
   percent_div.className = "percent";
   percent_div.innerHTML = (Number(percent) * 100).toString()+"%";

   barline_div = document.createElement("div");
   barline_div.className = "barline";
   bar_width = (Number(percent) * 66).toFixed(0)+"px";
   barline_div.style.width=bar_width;

   bar_div = document.createElement("div");
   bar_div.className = "bar";
   bar_div.appendChild(percent_div);
   bar_div.appendChild(barline_div);

   title_span = document.createElement("span");
   title_span.className = "title";
   title_span.innerHTML = title;
   
   icon_img = document.createElement("img");
   icon_img.src = icon_path;

   icon_a = document.createElement("a");
   icon_a.href = "index.html";
   icon_a.id = book;
   icon_a.onclick = function(e){
       home_item_link(this);
       return false;
   }
   icon_a.appendChild(icon_img);

   home_item = document.createElement("li");
   home_item.className = "m0"+id;
   home_item.appendChild(title_span);
   home_item.appendChild(icon_a);
   home_item.appendChild(bar_div);
   return home_item;
}

function home_load(data){
    icon_menu = document.getElementById("icon_menu");
    for (var i=0; i<data.length; i++){
        icon_menu.appendChild(create_home_icon_node(i, data[i]["book"], data[i]["title"], data[i]["icon_path"], data[i]["percent"]));
    }
}

function index_load(data, chapter_index){
    chapter_index = Number(chapter_index);
    pages = data["content"][chapter_index]["page"];
    insert_pages_into_chapter(pages);
}

function load_page(page_id){
    bullets_ul = document.getElementsByClassName("orbit-bullets");
    bullets_ul = bullets_ul[0];
    page_index = Number(page_id.slice(1))-1;
    bullets_ul.childNodes[page_index].click();
}

function nav_click(s) {
    data = document.getElementsByClassName("orbit-caption");
    var page_id;
    for (var i=0;i<data.length;i++){
        if (data[i].tagName == "DIV"){
            page_id = data[i].id.slice(1);
        }
    }
    before_slider_change(Values[1], Values[2], page_id);
    set_page_unread_img(page_id);
    return false;
}

function before_slider_change(book, chapter_index, page_id) {
    var type = "before_slider_change";
    var jsObj = {"book": book, 
        "chapter_index": chapter_index, 
        "page_id": page_id};
    var data = JSON.stringify(jsObj, "replacer");
    write_to_title(type, data);
}

function after_slider_change(imgObj, book, chapter_index) {
    var type = "after_slider_change";
    var jsObj = {"book": book, 
        "chapter_index": chapter_index, 
        "page_id": imgObj.getAttribute("data-caption")};
    var data = JSON.stringify(jsObj, "replacer");
    write_to_title(type, data);
}

function set_page_unread_img(page_id){
    current_page_img = document.getElementById(page_id);
    if (current_page_img.className == "unread"){
        current_page_img.className = "read";
    }
}
