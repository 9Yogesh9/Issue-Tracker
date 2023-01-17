// To control the visibility of new issue form
let main_container = document.getElementById('main_container');
let get_form = document.getElementById('get_form');
let reach_out = document.getElementsByClassName('reach_out')[0];

function toggle_form() {
    main_container.classList.toggle('blur_control');
    get_form.classList.toggle('form_visiblity_control');
    reach_out.classList.toggle('toggle_display');
}

// While creating labels for new project
let labels = document.getElementById('labels');
let display_labels = document.getElementById('display_labels');

// Temp labels list to for new labels
let label_list = [];

// holding the list of labels for the whole project
let project_label_list = {};
// Get Label data on load
getLabelData();
// Function to get the project labels data
function getLabelData() {
    let project_id = $('#project_id').val();
    $.ajax({
        type: 'get',
        url: `/project/project_labels/${project_id}`,
        success: (label_list) => {
            let project_labs = label_list.project_labels;
            if (!(project_labs.constructor === Object && Object.keys(project_labs).length === 0)) {
                project_label_list = JSON.parse(project_labs);
                paste_labels();
            }
        }, error: (error) => {
            console.log(error.responseText);
        }
    })
}

labels.addEventListener('keydown', (e) => {

    let get_value = labels.value;
    let suggestions = $('.search_suggest ul');
    suggestions.empty();
    $('.search_suggest').toggle(true);

    if (!get_value.length) return;
    // console.log(get_value);
    // let results = label_list.filter(a => a.includes(get_value));
    let results = Object.keys(project_label_list).filter(key => key.includes(get_value));
    // console.log(results);

    results.forEach(a => {
        let list_item = `<li>${a}</li>`;
        suggestions.append($(list_item));
    })

    if (e.key === 'Enter') {
        $('.search_suggest').toggle(false);
        let get_index = label_list.indexOf(get_value);

        if (get_index < 0) {
            let tag = document.createElement('span');
            tag.innerHTML = `${get_value}`;
            label_list.push(get_value);
            tag.setAttribute('id', `lab${get_value}`);
            tag.setAttribute('onclick', `remove_element('lab${get_value}','${get_value}')`);

            display_labels.appendChild(tag);
        }

        labels.value = "";
    }
});

function remove_element(ele_id, val) {
    // console.log(`val ${val} ${label_list.indexOf(val)}`);
    label_list.splice(label_list.indexOf(val), 1);
    document.getElementById(ele_id).remove();
}

// Create Issue
let create_issue = function () {
    let new_issue_form = $('#new_issue_form');
    new_issue_form.submit((e) => {
        e.preventDefault();
        if ($('#confirmation_box').is(":checked")) {
            label_list.forEach((i) => {
                if (!project_label_list[i])
                    project_label_list[i] = 1;
                else
                    project_label_list[i] += 1;
            })
            $.ajax({
                type: 'post',
                url: `/issues/create`,
                data: {
                    new_bug: new_issue_form.serialize(),
                    labels: label_list,
                    bulk_labels: JSON.stringify(project_label_list)
                },
                success: (data) => {
                    paste_new_issue(data.bug_details.bug);
                    $('.bugs_container h1').hide();
                    toggle_form();
                    $('#new_issue_form').trigger("reset");
                    $('#display_labels').empty();
                    $('#confirmation_box').prop('checked', false);
                    label_list = [],
                        paste_labels();
                },
                error: (error) => {
                    console.log(error.responseText);
                }
            })
        }
    })
}

create_issue();

// paste the HTML for new bug
function paste_new_issue(bug) {
    let labels = "";
    for (label of bug.labels) {
        if (label) {
            labels += `<div class="labels">${label}</div>`;
        }
    }
    let new_bug = `<div class="bug" id="issue_${bug._id}">
    <div class="bug_head">
        <div class="bug_title">
            ${bug.title}
        </div>
        <div class="label_holder">
            ${labels}
        </div>
        <div class="bug_author">
            ${bug.author}
        </div>
    </div>
    <div class="divide">
        <div class="bug_description">
            ${bug.description}
        </div>
        <div class="del_button" onclick="close_issue('${bug._id}')">X</div>
    </div>
</div>`

    $('.bugs_container').append($(new_bug));

}

// Close issue
function close_issue(issue_id) {
    let confirm_delete = confirm("Are you sure to close the issue ? \n To abort click on cancel.");

    if (confirm_delete) {
        $.ajax({
            type: 'post',
            url: `/issues/delete/${issue_id}`,
            success: (labels) => {
                // Refresh the project labels
                if (labels.issues == 1) $('.bugs_container h1').show();
                project_label_list = labels.project_labels;
                paste_labels();
                $(`#issue_${issue_id}`).remove();
            },
            error: (error) => {
                console.log(`Issue can't be closed !`);
            }
        })
    }
}

// Paste labels
function paste_labels() {
    $('.label_container').empty();
    for (label in project_label_list) {
        let label_component = `<div class="label_hold"><label for="${label}">${label}</label>
        <input type="checkbox" name="" id="${label}" onclick="addToList('${label}')"></div>`;
        $('.label_container').append(label_component);
    }
}

//------------------- Search functionality ------------------------
let search_btn = function () {
    $('.search_box button').click((e) => {
        e.preventDefault();
        let title = $('#title_search').val().trim();
        let description = $('#desc_search').val().trim();
        let author = $('#author_search').val().trim();

        let project_id = $('#project_id').val();

        $.ajax({
            method: 'post',
            url: `/search/do_search/${project_id}`,
            data: {
                title, description, author, search_labels
            },
            success: (data) => {
                $('.bugs_container .bug').remove();
                data.forEach(bug => paste_new_issue(bug));
            },
            error: (error) => {
                console.log("Error in search ", error.responseText);
            }
        })
    })
}
search_btn();

// Collect the labels to perform the filter function
let search_labels = [];
function addToList(label_id) {
    let val = $(`#${label_id}`).is(":checked");
    if (val)
        search_labels.push(label_id);
    else
        search_labels.splice(search_labels.indexOf(label_id), 1);
}