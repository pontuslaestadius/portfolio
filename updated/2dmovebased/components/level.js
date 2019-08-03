
const Level = {
    set: (n = 1) => {
        console.log(n);
        if (!Level.exists(n)) {
            return;
        }
        const selected = Level.__level__[n];
        if (!selected) {
            console.warn(`level ${n} does not exist`);
            return;
        }
        const old = Level.__level__[n];
        old.dealloc();
        selected.alloc();
    },

    next: () => {
        Level.set(Level.current() +1);
    },

    previous: () => {
        Level.set(Level.current() -1);
    },

    exists: (n) => {
        return n === Level.__current_level__;
    },

    current: () => {
        return Level.__current_level__;
    },

    __current_level__: 1,

    __level__: {
        1: {
            alloc: () => {
                document.body.style.backgroundColor = "#A9e2F3";
                new Shop({
                    x: 160,
                    y: c.height - 3 * size,
                    icon: vapen3_player,
                    price: 500
                });
                new Shop({
                    x: 230,
                    y: c.height - 3 * size,
                    icon: vapen2_player,
                    price: 200
                });
            },
            dealloc: () => {
                shop.forEach(x => delete x);
                shop = [];
            }
        },
        2: {
            alloc: () => {
                document.body.style.backgroundColor = "#A9e2F3";
            },
            dealloc: () => {
                enemy = [];
                drop = [];
            }
        },
        3: {
            alloc: () => {
                document.body.style.backgroundColor = "#bfbfbf";
                new Boss();
            },
            dealloc: () => {
                boss = [];
                bossdrop = [];
            }
        }
    }
}
