/*
    bJS.main

Forms FORM-29827281-12:
Test Assessment Report

This was a triumph.
I'm making a note here:
HUGE SUCCESS.
It's hard to overstate
my satisfaction.
Aperture Science
We do what we must
because we can.
For the good of all of us.
Except the ones who are dead.

But there's no sense crying
over every mistake.
You just keep on trying
till you run out of cake.
And the Science gets done.
And you make a neat gun.
For the people who are
still alive.

Forms FORM-55551-5:
Personnel File Addendum:

Dear <<Subject Name Here>>,

I'm not even angry.
I'm being so sincere right now.
Even though you broke my heart.
And killed me.
And tore me to pieces.
And threw every piece into a fire.
As they burned it hurt because
I was so happy for you!
Now these points of data
make a beautiful line.
And we're out of beta.
We're releasing on time.
So I'm GLaD. I got burned.
Think of all the things we learned
for the people who are
still alive.

Forms FORM-55551-6:
Personnel File Addendum Addendum:

One last thing:

Go ahead and leave me.
I think I prefer to stay inside.
Maybe you'll find someone else
to help you.
Maybe Black Mesa...
THAT WAS A JOKE. HA HA. FAT CHANCE.
Anyway, this cake is great.
It's so delicious and moist.
Look at me still talking
when there's Science to do.
When I look out there,
it makes me GLaD I'm not you.
I've experiments to run.
There is research to be done.
On the people who are
still alive.

PS: And believe me I am
still alive.
PPS: I'm doing Science and I'm
still alive.
PPPS: I feel FANTASTIC and I'm
still alive.

FINAL THOUGHT:
While you're dying I'll be
still alive.

FINAL THOUGHT PS:
And when you're dead I will be
still alive.

STILL ALIVE

Still alive.
*/
'use strict'

$('#close_ticket').on('click', async (e) => {
    e.preventDefault();
    if (e.target.attributes["data-ticket"].value) {
        if (confirm('Suer to close this ticket permanently?')) {
            const _obj = await fetch(`/admin/t/${e.target.attributes["data-ticket"].value}/close`, {
                method: 'POST'
            })
            const res = await _obj.json();
            console.log(res)
            if (res.status == 200) {
                if(!alert('Ticket Closed!')){window.location.reload();}
            }
        }
    }
});


$( document ).ready(function() {
    const staff_list = document.querySelectorAll('#assign_staff option');
    if(staff_list[0]){
        staff_list.forEach(stl => {
            //stl.innerHTML = '<span class="label label-Admin">Admin :)</span>' + stl.innerHTML
            //console.log(stl.innerHTML)
        });
    };
});
