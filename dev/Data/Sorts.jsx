export default [
    {
        id:1,
        type: "hot",
        nom:"Hot",
        cd:5,
        mana:5,
        tooltip:"Rends 5 points de vie par seconde pendant 5 secondes.",
        soin : 5,
        dureeSoin: 5
    },
    {
        id:2,
        type: "mono",
        nom:"Normal",
        cd:5,
        mana:10,
        tooltip:"Rends 20 points de vie.",
        soin : 20
    },
    {
        id:3,
        type: "mono",
        nom:"Flash",
        cd:2,
        mana:20,
        tooltip:"Rends 40 points de vie.",
        soin : 40
    },
    {
        id:4,
        type: "multi",
        nom:"Multi",
        cd:10,
        mana:20,
        tooltip:"Rends 10 points vie à tous le monde.",
        soin : 10
    },
    {
        id:5,
        type: "multi",
        nom:"Heroic",
        cd:40,
        mana:5,
        tooltip:"Rends 40 points vie à tous le monde.",
        soin : 50
    }
]