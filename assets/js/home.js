// To control the visibility of new project form
let main_container = document.getElementById('main_container');
let get_form = document.getElementById('get_form');

function toggle_form() {
    main_container.classList.toggle('blur_control');
    get_form.classList.toggle('form_visiblity_control');
}
// --------------------------

// To create new project using ajax
let createProject = function () {
    let newProjectForm = $('#new_project_form');

    newProjectForm.submit((e) => {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/project/create',
            data: newProjectForm.serialize(),
            success: (data) => {
                paste_new_project(data.data.project);
                toggle_form();
                $(newProjectForm).trigger("reset");
            },
            error: (error) => { console.log(error.responseText); }
        })
    })
}

createProject();

// Render the new project created 
function paste_new_project(project) {
    let new_project = `<div class="card">
                            <div class="part1">
                                <h2>${project.name}</h2>
                                <p>${project.author}</p>
                            </div>
                            <div class="part2">
                                <div class="delete_project" onclick="delete_project('${project._id}')">
                                    X
                                </div>
                            </div>
                        </div>`;

    $('.content_container').append($(new_project));
}

// Delete the project
function delete_project(project_id) {
    let confirm_delete = confirm("Are you sure to delete the project ? \n All the data related to project will be erased. \n To abort click on cancel.");

    if (confirm_delete) {
        $.ajax({
            type: 'post',
            url: `/project/delete/${project_id}`,
            success: (data) => {
                console.log(`Project deleted !`);
                $(`#card_${project_id}`).remove();
            },
            error: (error) => {
                console.log(`Project can't be deleted`);
            }
        })
    }
}