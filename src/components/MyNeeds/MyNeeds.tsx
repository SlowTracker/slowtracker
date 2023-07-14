"use client"
import {Need, NeedsByCategory} from "@/app/api/needs/route";
import React from 'react'
import styles from "./MyNeeds.module.css"
import {SortableContainer, SortableElement} from 'react-sortable-hoc';


const saveToLocalStorage = (selectedNeeds: Need['id'][]) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("myNeeds", JSON.stringify(selectedNeeds))
    }
}

const getFromLocalStorage = (): Need['id'][] => {
    if (typeof window !== "undefined") {
        const myNeeds = localStorage.getItem("myNeeds")
        if (myNeeds) {
            return JSON.parse(myNeeds)
        }
    }

    return []
}

const SortableSelectedNeed = SortableElement<{need: Need, toggleNeed: (need: Need) => void}>(({need, toggleNeed}: {need: Need, toggleNeed: (need: Need) => void}) => {
    return <li className={styles.floatingSortableListElement}>
        <h4>
            <span className={styles.removeButton} onClick={() => toggleNeed(need)}>X</span>
            <span className={styles.categoryName}>{need.category}</span>
            <span className={styles.needName}>{need.label}</span>
        </h4>
    </li>
})


const SortableSelectedNeeds = SortableContainer<{selectedNeeds: Need[], toggleNeed: (need: Need) => void}>(({selectedNeeds, toggleNeed}: {selectedNeeds: Need[], toggleNeed: (need: Need) => void}) => {
    return <ul>
        {selectedNeeds.map((need, index) => {
            return <SortableSelectedNeed key={need.label} index={index} need={need} toggleNeed={toggleNeed} />
        })}
        </ul>
})

export const MyNeeds = ({needs}: {needs: NeedsByCategory[]}) => {
    const [selectedNeeds, setSelectedNeeds] = React.useState<Need['id'][]>([])

    React.useEffect(() => {
        setSelectedNeeds(getFromLocalStorage())
    }, [])

    const toggleNeed = (need: Need) => {
        if (selectedNeeds.includes(need.id)) {
            const newList = selectedNeeds.filter((selectedNeed) => selectedNeed !== need.id)
            setSelectedNeeds(newList)
            saveToLocalStorage(newList)
        } else {
            const newList = [...selectedNeeds,
                need.id
            ]
            setSelectedNeeds(newList)
            saveToLocalStorage(newList)
        }

    }

    const listOfSelectedNeeds = selectedNeeds.map((needId) => {
        const need = needs.find((need) => need.needs.find((need) => need.id === needId))
        if (need) {
            const selectedNeed = need.needs.find((need) => need.id === needId)
            if (selectedNeed) {
                return selectedNeed
            }
        }
    }).filter((need) => need !== undefined) as Need[]

    const onSortEnd = ({oldIndex, newIndex}: {oldIndex: number, newIndex: number}) => {
        const newList = [...selectedNeeds]
        newList.splice(newIndex, 0, newList.splice(oldIndex, 1)[0])
        setSelectedNeeds(newList)
        saveToLocalStorage(newList)
    }

    return (
        <div className={styles.MyNeeds}>
            <div className={styles.AllNeeds}>
                <h2>Przykładowe potrzeby</h2>
                {needs.map((need) => {
                    return <ul key={need.category}>
                        <li className={"text-2xl font-bold " + styles.MyNeedsList}>
                            <h3>{need.category}</h3>
                            <ul>
                                {need.needs.map((need: Need) => {
                                    return (
                                        <li key={need.label} onClick={() => toggleNeed(need)} className={
                                            selectedNeeds.includes(need.id) ? styles.active : ""
                                        }>
                                            <h4>{need.label}</h4>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>

                    </ul>
                })}
            </div>

            <div className={styles.SelectedNeeds}>
                <h2>Lista moich potrzeb</h2>
                <SortableSelectedNeeds selectedNeeds={listOfSelectedNeeds} toggleNeed={toggleNeed} onSortEnd={onSortEnd} />
            </div>
        </div>
    );
}