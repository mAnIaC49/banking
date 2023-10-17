document.addEventListener('DOMContentLoaded', function() {

    // Check whether there is already a saved game and enable the load button only if there is one
    document.getElementById("load").style.pointerEvents = "none";
    document.getElementById("load").style.cursor="default";
    fetch('/load', {
            method: 'POST',
            body: JSON.stringify({

            })
        })
        .then(response => response.json())
        .then(result => {
            if (result["saved"] === true) {
                document.getElementById("load").style.pointerEvents = "auto";
                document.getElementById("load").style.cursor="pointer";
            }
        })

    // The following code is to be run in the page that submits the forms
    if (document.getElementById("number") !== null)
    {
        // Disable the save button
        document.getElementById('save').disabled = true;

        // The javascript code to run after the submission of the form that takes as input the total number of players
        document.getElementById("number").onsubmit = () => {
            let num = document.querySelector('#num-input').value;

            // Hide the form that takes the input of the number of players and reveal the form that takes as input the names of the players
            document.querySelector('#form-div').style.display = 'none';
            document.querySelector('#names-div').style.display = 'block';

            
            let form = document.getElementById("names");

            // Insert a hidden element storing the number of players to be used by next view
            let hid = document.createElement("input");
            hid.hidden = "true";
            hid.name = "num";
            hid.value = `${num}`;
            form.appendChild(hid);

            // Based on the number of players create input tags that take as input the names of the players

            for (let i = 0; i < num; i++)
            {
                let el = document.createElement("input");
                el.placeholder = `Player ${i+1}`;
                el.name = `player${i+1}`;
                el.required = "true";
                el.classList.add('players', 'form-control');
                let sel = document.getElementById('amount');
                form.insertBefore(el, sel);
            }

            return false;
        };

    }
    else {

        // The following code runs in the game page

        let arr = document.querySelectorAll(".people");
        let obj = {};
        let amount = parseInt(document.querySelectorAll('.amount')[0].innerHTML);

        for (let i = 0; i < arr.length; i++)
        {
            let name = arr[i].dataset.person;
            obj[name] = amount;
        }

        // If this is a loaded game, update the money based on the saved data which is asynchronously retrieved
        if (document.getElementById("loaded").innerHTML === 'yes')
        {
            fetch('/load')
            .then(response => response.json())
            .then(result => {
                let data = result["data"];

                let people = document.querySelectorAll('.people');

                for (let i = 0; i < people.length; i++)
                {
                    people[i].querySelector(".amount").innerHTML = data[people[i].dataset.person];
                }

                obj = data;
            })
        }


        // The following code is to run on click of the add button
        document.querySelectorAll('.btn-add').forEach(add => {
            add.onclick = function() {
                let parent = this.parentElement.parentElement;

                // First hide all other forms
                document.querySelectorAll('.add').forEach(div => {
                    div.style.display = 'none';
                })

                document.querySelectorAll('.deduct').forEach(div => {
                    div.style.display = 'none';
                })

                document.querySelectorAll('.transfer').forEach(div => {
                    div.style.display = 'none';
                })

                // Show the required form
                parent.querySelector('.add').style.display = 'block';
                
            }
            
        });
    
    
        // The following code is to be run on click of the deduct button
        document.querySelectorAll('.btn-deduct').forEach(deduct => {
            deduct.onclick = function() {
                let parent = this.parentElement.parentElement;
                
                document.querySelectorAll('.add').forEach(div => {
                    div.style.display = 'none';
                })

                document.querySelectorAll('.deduct').forEach(div => {
                    div.style.display = 'none';
                })

                document.querySelectorAll('.transfer').forEach(div => {
                    div.style.display = 'none';
                })

                parent.querySelector('.deduct').style.display = 'block';

            }
        });
        
        // The following code is to be run on click of the transfer button
        document.querySelectorAll('.btn-transfer').forEach(transfer => {
            transfer.onclick = function() {
                let parent = this.parentElement.parentElement;
                let data = parent.dataset.person;
                
                // Hide all the other forms
                document.querySelectorAll('.add').forEach(div => {
                    div.style.display = 'none';
                })

                document.querySelectorAll('.deduct').forEach(div => {
                    div.style.display = 'none';
                })

                document.querySelectorAll('.transfer').forEach(div => {
                    div.style.display = 'none';
                })

                // Show the form that takes in as input the amount to be transfered
                let trans = parent.querySelector('.transfer');
                trans.style.display = 'block';

                // Create option elements containing as values the names of other players and append it to the select element
                let select = trans.querySelector('select');               
                let people = Object.keys(obj);

                for (let i = 0; i < people.length; i++)
                {
                    if (people[i] !== data)
                    {
                        let opt = document.createElement('option');
                        opt.value = people[i];
                        opt.innerHTML = people[i];

                        select.appendChild(opt);
                    }
                }
            }
        });

        document.querySelectorAll('.add-form').forEach(form => {
            form.onsubmit = function() {
                let a = parseInt(this.querySelector('input').value);

                let user = this.parentElement.parentElement.parentElement.dataset.person;

                let b = obj[user];
                
                let sum = a + b;

                obj[user] = sum;

                document.getElementById(user).querySelector('.amount').innerHTML = sum;

                this.querySelector('input').value = '';

                return false;
            }
        })

        document.querySelectorAll('.deduct-form').forEach(form => {
            form.onsubmit = function() {
                let a = parseInt(this.querySelector('input').value);

                let user = this.parentElement.parentElement.parentElement.dataset.person;

                let b = obj[user];
                
                let sum = b - a;

                obj[user] = sum;

                document.getElementById(user).querySelector('.amount').innerHTML = sum;

                this.querySelector('input').value = '';

                return false;
            }
        })

        document.querySelectorAll('.transfer-form').forEach(form => {
            form.onsubmit = function() {
                let a = parseInt(this.querySelector('input').value);

                let user_from = this.parentElement.parentElement.parentElement.dataset.person;
                let user_to = this.querySelector('select').value;

                let from = obj[user_from];
                let to = obj[user_to];

                obj[user_from] = from - a;
                obj[user_to] = to + a;

                document.getElementById(user_from).querySelector('.amount').innerHTML = obj[user_from];
                document.getElementById(user_to).querySelector('.amount').innerHTML = obj[user_to];
                
                this.querySelector('input').value = '';

                return false;
            }
        })

        // On clicking the save button, an asynchronous post request is sent that sends the data to be saved for further process
        document.getElementById("save").onclick = function() {
            fetch('/save' ,{
                method: 'POST',
                body: JSON.stringify({
                    data: obj,
                    currency: document.querySelectorAll(".currency")[0].innerHTML
                })
            })
            .catch(error => {
                console.log('Error:', error)
            });
        }

    
    }
});