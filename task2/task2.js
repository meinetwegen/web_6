var party = [
    {
        id: 'balcony', name: 'Balcony', floor: 2,
        guests: [
            { name: 'Aigerim', color: 'green',  time: '20:45', aitu: true,  things: ['cup', 'crumbs'] },
            { name: 'Aliya',   color: 'black',  time: '21:15', aitu: false, things: ['phone', 'cup'] },
            { name: 'Madina',  color: 'green',  time: '22:10', aitu: false, things: ['phone', 'bag', 'crumbs'] },
            { name: 'Ivan',    color: 'black',  time: '20:10', aitu: true,  things: ['cup'] }
        ]
    },
    {
        id: 'hall', name: 'Hall', floor: 2,
        guests: [
            { name: 'Arman',   color: 'yellow', time: '20:35', aitu: false, things: ['bag', 'glasses'] },
            { name: 'Sophia',  color: 'purple', time: '21:20', aitu: true,  things: ['phone'] },
            { name: 'Dias',    color: 'green',  time: '19:45', aitu: true,  things: [] },
            { name: 'Bekzat',  color: 'purple', time: '20:55', aitu: false, things: ['bag', 'cup', 'crumbs'] },
            { name: 'Aruzhan', color: 'blue',   time: '21:50', aitu: true,  things: ['phone'] },
            { name: 'Saule',   color: 'green',  time: '21:25', aitu: false, things: ['glasses'] }
        ]
    },
    {
        id: 'kitchen', name: 'Kitchen', floor: 1,
        guests: [
            { name: 'Nurlan',  color: 'red',    time: '19:40', aitu: true,  things: ['phone', 'cup'] },
            { name: 'Emma',    color: 'black',  time: '20:15', aitu: false, things: ['bag'] },
            { name: 'Timur',   color: 'green',  time: '21:05', aitu: true,  things: ['phone', 'bag', 'crumbs'] },
            { name: 'Sergey',  color: 'yellow', time: '20:50', aitu: false, things: [] },
            { name: 'Yerlan',  color: 'red',    time: '21:40', aitu: true,  things: ['glasses', 'phone'] },
            { name: 'Kamila',  color: 'green',  time: '20:05', aitu: false, things: ['cup'] }
        ]
    },
    {
        id: 'living', name: 'Living room', floor: 1,
        guests: [
            { name: 'Daniel',  color: 'blue',   time: '19:55', aitu: true,  things: ['glasses'] },
            { name: 'Zarina',  color: 'green',  time: '21:10', aitu: false, things: ['bag', 'phone', 'crumbs'] },
            { name: 'Natasha', color: 'yellow', time: '20:30', aitu: true,  things: [] },
            { name: 'Askar',   color: 'black',  time: '21:00', aitu: true,  things: ['phone'] },
            { name: 'Inkar',   color: 'purple', time: '20:20', aitu: false, things: ['bag'] }
        ]
    }
];

$.each(party, function (i, room) {
    room.sorted = false;
    $.each(room.guests, function (j, g) {
        g.pos = j;
    });
});

var icons = { phone: '📱', glasses: '👓', bag: '👜', cup: '☕', crumbs: '🍰' };
var words = { phone: 'a phone', glasses: 'glasses', bag: 'a bag', cup: 'a cup', crumbs: 'cake crumbs' };
var colors = {
    red: 'e5484d', blue: '3e63dd', green: '30a46c',
    black: '2b2b2b', yellow: 'f5b829', purple: '8e4ec6'
};

function roomById(id) {
    return $.grep(party, function (room) { return room.id === id; })[0];
}

function avatarUrl(g) {
    return 'https://api.dicebear.com/9.x/open-peeps/svg?seed=' + g.name +
        '&clothingColor=' + colors[g.color];
}

function guestCard(g) {
    var $card = $('<div class="guest"></div>')
        .attr({
            id: g.name.toLowerCase(),
            'data-name': g.name,
            'data-color': g.color,
            'data-time': g.time,
            'data-aitu': g.aitu,
            'data-things': g.things.join(' ')
        })
        .addClass(g.color)
        .addClass(g.things.join(' '))
        .toggleClass('aitu', g.aitu);

    $('<img class="avatar">').attr({ src: avatarUrl(g), alt: g.name }).appendTo($card);
    if (g.aitu) {
        $('<span class="badge" title="AITU student">🎓</span>').appendTo($card);
    }
    $('<div class="name"></div>').text(g.name).appendTo($card);
    $('<div class="time"></div>').text('🕒 ' + g.time).appendTo($card);

    var $things = $('<div class="things"></div>').appendTo($card);
    $.each(g.things, function (i, thing) {
        $('<span class="thing"></span>').text(icons[thing]).attr('title', thing).appendTo($things);
    });
    return $card;
}

function buildParty() {
    $('.flying').stop(true).remove();
    var $floors = $('#floors').empty();

    $.each([2, 1], function (i, floor) {
        var $floor = $('<div class="floor"></div>')
            .attr('data-floor', floor)
            .append($('<div class="floor-label"></div>').text('Floor ' + floor));

        $.each(party, function (j, room) {
            if (room.floor !== floor) return;

            var $head = $('<div class="room-head"></div>')
                .append($('<h3></h3>').text(room.name))
                .append($('<button class="sort">⏱ Sort by time</button>')
                    .attr('data-room', room.id)
                    .toggleClass('on', room.sorted));

            var $room = $('<section class="room"></section>')
                .attr({ id: room.id, 'data-name': room.name, 'data-floor': room.floor })
                .append($head);

            var $list = $('<div class="guests"></div>').appendTo($room);
            $.each(room.guests, function (k, g) {
                $list.append(guestCard(g));
            });
            $floor.append($room);
        });

        $floors.append($floor);
    });
}

var cases = [
    {
        q: 'Who is in the hall?',
        find: function () {
            return $('#hall .guest');
        }
    },
    {
        q: 'Who is dressed in yellow or purple?',
        find: function () {
            return $('.guest.yellow, .guest.purple');
        }
    },
    {
        q: 'Which AITU students are upstairs?',
        find: function () {
            return $('.floor[data-floor="2"] .guest.aitu');
        }
    },
    {
        q: 'Who has glasses or a bag?',
        find: function () {
            return $('.guest').filter('.glasses, .bag');
        }
    },
    {
        q: 'Who came with nothing at all?',
        find: function () {
            return $('.guest[data-things=""]');
        }
    },
    {
        q: 'Who has a phone but no bag?',
        find: function () {
            return $('.guest.phone:not(.bag)');
        }
    },
    {
        q: 'Who arrived between 20:30 and 21:00, both times included?',
        find: function () {
            return $('.guest').filter(function () {
                var t = $(this).data('time');
                return t >= '20:30' && t <= '21:00';
            });
        }
    },
    {
        q: 'Who arrived after 21:00 and is not an AITU student?',
        find: function () {
            return $('.guest:not(.aitu)').filter(function () {
                return $(this).data('time') > '21:00';
            });
        }
    },
    {
        q: 'Who stands right next to Askar?',
        find: function () {
            return $('#askar').prev().add('#askar + .guest');
        }
    },
    {
        q: 'Who stands last in each room?',
        find: function () {
            return $('.guest:last-child');
        }
    },
    {
        q: 'Who stands third in each room?',
        find: function () {
            return $('.guest:nth-child(3)');
        }
    },
    {
        q: 'Who stands after Timur in his room?',
        find: function () {
            return $('#timur').nextAll();
        }
    },
    {
        q: 'Who stands right before someone in black?',
        find: function () {
            return $('.guest.black').prev();
        }
    },
    {
        q: 'In which room is Aruzhan?',
        find: function () {
            return $('#aruzhan').closest('.room');
        }
    },
    {
        q: 'Which rooms have fewer than 6 guests?',
        find: function () {
            return $('.room').filter(function () {
                return $(this).find('.guest').length < 6;
            });
        }
    },
    {
        q: 'In which rooms does somebody have a cup, but nobody wears glasses?',
        find: function () {
            return $('.room:has(.guest.cup):not(:has(.guest.glasses))');
        }
    },
    {
        q: 'Who came first to each room?',
        find: function () {
            return $('.guest').filter(function () {
                var t = $(this).data('time');
                return $(this).siblings().filter(function () {
                    return $(this).data('time') < t;
                }).length === 0;
            });
        }
    },
    {
        q: 'Miras (AITU, blue, 21:20, phone) joins Askar and Inkar, standing between them.',
        note: 'Miras appeared smoothly between Askar and Inkar.',
        find: function () {
            return guestCard({ name: 'Miras', color: 'blue', time: '21:20', aitu: true, things: ['phone'] })
                .hide()
                .insertAfter('#askar')
                .fadeIn(800);
        }
    },
    {
        q: 'Natasha says goodbye and goes home.',
        note: 'Natasha said goodbye: her card faded away and was removed from the page.',
        find: function () {
            return $('#natasha').addClass('leaving').fadeOut(800, function () {
                $(this).remove();
            });
        }
    },
    {
        q: 'Who took the cake?',
        note: 'Downstairs, came 21:00–21:30, has crumbs, no cup, next to an AITU student.',
        find: function () {
            return $('.floor[data-floor="1"] .guest')
                .filter(function () {
                    var t = $(this).data('time');
                    return t > '21:00' && t < '21:30';
                })
                .filter('.crumbs:not(.cup)')
                .filter(function () {
                    var $near = $(this).prev().add($(this).next());
                    return $near.is('.aitu');
                });
        }
    }
];

function chainText(fn) {
    var lines = fn.toString().split('\n').slice(1, -1);
    var indent = Math.min.apply(null, $.map(lines, function (line) {
        return line.trim() ? line.match(/^\s*/)[0].length : 999;
    }));
    return $.map(lines, function (line) {
        line = line.slice(indent);
        var spaces = line.match(/^\s*/)[0].length;
        return line.slice(spaces / 2);
    })
        .join('\n')
        .replace(/^return\s+/, '')
        .replace(/;\s*$/, '');
}

function jump($guests) {
    $guests.stop('move', true)
        .animate({ top: -16 }, { duration: 180, queue: 'move' })
        .animate({ top: 0 }, { duration: 180, queue: 'move' })
        .dequeue('move');
}

function showResult(n, $found) {
    var c = cases[n - 1];
    var isRooms = $found.is('.room');
    var names = $found.map(function () {
        return $(this).data('name');
    }).get();

    $found.addClass('found');
    jump(isRooms ? $found.find('.guest') : $found);

    var word = isRooms ? 'room' : 'guest';
    if (names.length !== 1) word += 's';

    var $result = $('#result').empty();
    $('<div class="result-title"></div>').text('Case ' + n).appendTo($result);
    $('<div class="result-q"></div>').text(c.q).appendTo($result);
    $('<div class="result-count"></div>')
        .append($('<b></b>').text(names.length))
        .append(' ' + word + ' found')
        .appendTo($result);
    $('<div class="result-names"></div>').text(names.join(', ') || '—').appendTo($result);
    if (c.note) {
        $('<div class="result-note"></div>').text(c.note).appendTo($result);
    }
    $('<pre class="result-code"></pre>').text(chainText(c.find)).appendTo($result);
}

function rememberLight() {
    var light = {};
    $('.guest').each(function () {
        light[this.id] = $(this).css('opacity');
    });
    return light;
}

function restoreLight(light) {
    $('.guest').each(function () {
        if (light[this.id] !== undefined) {
            $(this).css('opacity', light[this.id]);
        }
    });
}

function spotlight($found) {
    var $bright = $found;  
    if ($found.is('.room')) {
        $bright = $found.find('.guest');
    }
    if ($found.is('.leaving')) {
        $bright = $found.closest('.room').find('.guest');
    }

    $bright.not('.leaving').fadeTo(300, 1);
    $('.guest').not($bright).stop('fx', true).fadeTo(300, 0.2);
}

function clearSpotlight() {
    $('.guest').not('.leaving').stop('fx', true).fadeTo(300, 1);
    $('.found').removeClass('found');
    $('.case').removeClass('active');

    $('#result').empty()
        .append('<div class="result-title">Detective notes</div>')
        .append('<div class="result-names">Click a case to start the investigation.</div>');
}



var $info = null;

function listWords(list) { 
    if (list.length < 2) return list.join('');
    return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
}

function infoContent($g) {
    var name = $g.data('name');
    var color = $g.data('color');
    var things = $.grep($g.attr('data-things').split(' '), function (t) { return t !== ''; });
    var $room = $g.closest('.room');
    var roomName = $room.data('name').toLowerCase();
    var place = $room.find('.guest').index($g) + 1;
    var count = $room.find('.guest').length;

    var thingsText = things.length
        ? 'Has ' + listWords($.map(things, function (t) { return words[t]; }))
        : 'Came with nothing';

    var $box = $('<div class="info-inner"></div>');

    var $top = $('<div class="info-top"></div>').appendTo($box);
    $('<img>')
        .attr({ src: $g.find('.avatar').attr('src'), alt: name })
        .css('border-color', 'var(--' + color + ')')
        .appendTo($top);
    $('<div></div>')
        .append($('<h2></h2>').text(name))
        .append($('<div class="info-sub"></div>').text($room.data('name') + ' · floor ' + $room.data('floor')))
        .appendTo($top);

    var $list = $('<ul></ul>').appendTo($box);
    $.each([
        ['🕒', 'Came at ' + $g.data('time')],
        ['🎓', $g.hasClass('aitu') ? 'AITU student' : 'Not an AITU student'],
        ['👕', 'Dressed in ' + color],
        ['✋', thingsText],
        ['📍', 'Stands in the ' + roomName + ', place ' + place + ' of ' + count]
    ], function (i, line) {
        $('<li></li>')
            .append($('<span></span>').text(line[0]))
            .append(document.createTextNode(line[1]))
            .appendTo($list);
    });

    var $moves = $('<div class="info-moves"></div>').appendTo($box);
    $('.room').not($room).each(function () {
        $('<button class="move"></button>')
            .attr('data-room', this.id)
            .text('Move to the ' + $(this).data('name').toLowerCase())
            .appendTo($moves);
    });

    $('<div class="info-hint">Esc or a click outside closes the card</div>').appendTo($box);
    return $box;
}

function openInfo($guest) {
    closeInfo();

    var $photo = $guest.find('.avatar');
    var from = $photo.offset();
    var small = $photo.outerWidth();

    $info = $('<div class="info"></div>')
        .attr('data-guest', $guest.attr('id'))
        .append(infoContent($guest))
        .css({ visibility: 'hidden', left: 0, top: 0 })
        .appendTo('body');

    var w = $info.outerWidth();
    var h = $info.outerHeight();
    var $win = $(window);
    var left = $win.scrollLeft() + ($win.width() - w) / 2;
    var top = $win.scrollTop() + Math.max(12, ($win.height() - h) / 2);

    $info
        .css({
            visibility: 'visible',
            left: from.left, top: from.top,
            width: small, height: small,
            opacity: 0.5, borderRadius: small / 2
        })
        .animate({
            left: left, top: top,
            width: w, height: h,
            opacity: 1, borderRadius: 16
        }, 350);
}

function closeInfo(done) {
    if (!$info) {
        if (done) done();
        return;
    }
    var $card = $info;
    $info = null;
    $card.addClass('closing');

    var $photo = $('#' + $card.attr('data-guest')).find('.avatar');
    var to, small;
    if ($photo.length) {
        to = $photo.offset();
        small = $photo.outerWidth();
    } else {
        var o = $card.offset();
        to = { left: o.left + $card.outerWidth() / 2, top: o.top + $card.outerHeight() / 2 };
        small = 0;
    }

    $card.stop(true).animate({
        left: to.left, top: to.top,
        width: small, height: small,
        opacity: 0, borderRadius: small / 2
    }, 250, function () {
        $card.remove();
        if (done) done();
    });
}

function moveInArray(id, toId) {
    var guest = null;
    $.each(party, function (i, room) {
        $.each(room.guests, function (j, g) {
            if (g.name.toLowerCase() === id) {
                guest = room.guests.splice(j, 1)[0];
                return false;
            }
        });
        if (guest) return false;
    });
    if (!guest) return;

    var to = roomById(toId);
    var lastPos = -1;
    $.each(to.guests, function (i, g) { lastPos = Math.max(lastPos, g.pos); });
    guest.pos = lastPos + 1;
    to.guests.push(guest);
}

function moveGuest(id, toId) {
    var $g = $('#' + id);
    if (!$g.length || $g.closest('.room').attr('id') === toId) return;

    moveInArray(id, toId);

    var start = $g.offset();
    var w = $g.outerWidth(true);
    var h = $g.outerHeight(true);
    var ml = parseFloat($g.css('marginLeft'));
    var mt = parseFloat($g.css('marginTop'));

    var $fly = $g.clone()
        .removeAttr('id')
        .removeClass('guest found')
        .addClass('flying')
        .css({ left: start.left, top: start.top })
        .appendTo('body');

    var $oldGap = $('<div class="gap"></div>').css({ width: w, height: h }).insertBefore($g);
    $g.stop('move', true).css({ left: 0, top: 0 }).detach();
    $oldGap.animate({ width: 0 }, 600, function () {
        $(this).remove();
    });

    var $newGap = $('<div class="gap"></div>')
        .attr('data-for', id)
        .css({ width: 0, height: h })
        .appendTo('#' + toId + ' .guests')
        .animate({ width: w }, 600);

    var end = $newGap.offset();
    $fly.animate({ left: end.left + ml, top: end.top + mt }, {
        duration: 900,
        step: function (now, fx) {
            var place = $newGap.offset();
            fx.end = (fx.prop === 'left') ? place.left + ml : place.top + mt;
        },
        complete: function () {
            $newGap.replaceWith($g);
            $fly.remove();
        }
    });
}

function byTime(a, b) {
    return a.time < b.time ? -1 : 1;
}
function byPicture(a, b) {
    return a.pos - b.pos;
}

function sortRoom(roomId) {
    var room = roomById(roomId);
    room.sorted = !room.sorted;
    room.guests.sort(room.sorted ? byTime : byPicture);

    var $list = $('#' + roomId + ' .guests');
    var $cards = $list.children('.guest');

    var before = {};
    $cards.each(function () {
        before[this.id] = $(this).position();
    });

    $cards.stop('move', true).css({ left: 0, top: 0 });
    $.each(room.guests, function (i, g) {
        var id = g.name.toLowerCase();
        $list.append($list.children('#' + id + ', .gap[data-for="' + id + '"]'));
    });

    $cards.each(function () {
        var now = $(this).position();
        var old = before[this.id];
        $(this)
            .css({ left: old.left - now.left, top: old.top - now.top })
            .animate({ left: 0, top: 0 }, { duration: 600, queue: 'move' })
            .dequeue('move');
    });

    $('#' + roomId + ' .sort').toggleClass('on', room.sorted);
}


$(function () {
    buildParty();

    $.each(cases, function (i, c) {
        $('<button class="case"></button>')
            .attr('data-case', i + 1)
            .append($('<b></b>').text(i + 1))
            .append($('<span></span>').text(c.q))
            .appendTo('#cases');
    });

    $('#cases').on('click', '.case', function () {
        var n = $(this).data('case');

        $('.case').removeClass('active');
        $(this).addClass('active');

        var light = rememberLight();
        buildParty();
        restoreLight(light);

        var $found = cases[n - 1].find();
        showResult(n, $found);
        spotlight($found);
    });

    $('#clear').on('click', clearSpotlight);

    $('#floors').on('click', '.guest', function (e) {
        e.stopPropagation();
        if ($(this).hasClass('leaving')) return;

        if ($info && $info.attr('data-guest') === this.id) {
            closeInfo();
        } else {
            openInfo($(this));
        }
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.info').length) {
            closeInfo();
        }
    });
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            closeInfo();
        }
    });

    $(document).on('click', '.move', function () {
        var $card = $(this).closest('.info');
        if ($card.hasClass('closing')) return;

        var id = $card.attr('data-guest');
        var roomId = $(this).data('room');
        closeInfo(function () {
            moveGuest(id, roomId);
        });
    });

    $('#floors').on('click', '.sort', function () {
        sortRoom($(this).data('room'));
    });
});
