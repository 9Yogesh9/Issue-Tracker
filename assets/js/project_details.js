// To control the visibility of new project form
let main_container = document.getElementById('main_container');
let get_form = document.getElementById('get_form');

function toggle_form() {
    main_container.classList.toggle('blur_control');
    get_form.classList.toggle('form_visiblity_control');
}

// While creating labels for new project
let labels = document.getElementById('labels');
let display_labels = document.getElementById('display_labels');
let label_list = [];

labels.addEventListener('keydown', (e) => {

    let get_value = labels.value;
    let suggestions = $('.search_suggest ul');
    suggestions.empty();

    if(!get_value.length) return;
    // console.log(get_value);
    let results = label_list.filter(a => a.includes(get_value));
    // console.log(results);

    results.forEach(a =>{
        let list_item = `<li>${a}</li>`;
        suggestions.append($(list_item));
    })

    if (e.key === 'Enter') {
        
        let get_index = label_list.indexOf(get_value);

        if(get_index < 0){
            let tag = document.createElement('span');
            tag.innerHTML = `${get_value}`;
            label_list.push(get_value);
            tag.setAttribute('id',`lab${get_value}`);
            tag.setAttribute('onclick', `remove_element('lab${get_value}','${get_value}')`);
            
            display_labels.appendChild(tag);            
        }

        labels.value = "";
    }
});

function remove_element(ele_id,val){
    // console.log(`val ${val} ${label_list.indexOf(val)}`);
    label_list.splice(label_list.indexOf(val),1);
    document.getElementById(ele_id).remove();
}

let create_issue = function(){
    let new_issue_form = $('#new_issue_form');
    new_issue_form.submit((e)=>{
        e.preventDefault();
    })
}

// create_issue();

// close issue
function close_issue(issue_id) {
    let confirm_delete = confirm("Are you sure to close the issue ? \n To abort click on cancel.");

    if (confirm_delete) {
        $.ajax({
            type: 'post',
            url: `/issues/delete/${issue_id}`,
            success: (data) => {
                console.log(`Issue closed !`);
                $(`#issue_${issue_id}`).remove();
            },
            error: (error) => {
                console.log(`Issue can't be closed !`);
            }
        })
    }
}