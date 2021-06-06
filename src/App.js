import './App.css';
import * as XLSX from 'xlsx'
import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
// import video from '../media/M_03292018202006_00000000U2940605_1_001-1.MP4'

function App() {
	const [vocabData, setVocabData] = useState([])
	const [isStart, setIsStart] = useState(false)
	const [currentWord, setCurrentWord] = useState("")
	const [word, setWord] = useState("")
	const [isCorrect, setIsCorrect] = useState(false)
	const [complishment, setComplishment] = useState("")

	const good = ["gioi qua i", "vjp", "đc", "pro", "sieeu cap", "gioi qua ta", "dang cap", "👍"]
	const bad = ["NGU"]

	const readExcel = file => {
		const promise = new Promise((resolve, reject) => {
			const fileReader = new FileReader()
			fileReader.readAsArrayBuffer(file)

			fileReader.onload = e => {
				const bufferArray = e.target.result
				const wb = XLSX.read(bufferArray, { type: 'buffer' })
				const wsname = wb.SheetNames[1]
				const ws = wb.Sheets[wsname]
				const data = XLSX.utils.sheet_to_json(ws)
				resolve(data)
			}
			fileReader.onerror = ((er) => {
				reject(er)
			})
		})

		promise.then((d) => {
			let fil = d.filter(word => word["第~か"] >= 4 && word["第~か"] <= 5)
			setVocabData(fil)
		}).then(() => { setIsStart(true) })
	}

	const randomWord = () => {
		let item = vocabData[Math.floor(Math.random() * vocabData.length)]
		setCurrentWord(() => item)
	}

	useEffect(() => {
		randomWord()
	}, [isStart])

	const handlePlay = e => {
		e.preventDefault()
		console.log(word)
		console.log(currentWord)
		if (word === currentWord["読み方"] || word === currentWord["ことば"]) {
			setWord(() => '')
			randomWord()
			setIsCorrect(true)
			setComplishment(() => good[Math.floor(Math.random() * good.length)])
		} else {
			setComplishment(() => bad[Math.floor(Math.random() * bad.length)])
			setIsCorrect(false)
		}
	}

	return (
		<div className="App">
			<div>
				<input type="file" id="input" onChange={(e) => {
					const file = e.target.files[0]
					readExcel(file)
				}} />
				{isStart && currentWord ? <p>{currentWord["意味"]}</p> : null}
				{isStart ?
					<form onSubmit={handlePlay}>
						<input type="text" placeholder="meaning" onChange={e => setWord(e.target.value)} value={word} />
					</form>
					: null
				}
				<p style={{ color: isCorrect ? "green" : "red", fontSize: isCorrect ? 20 : 100 }}>{complishment !== "NGU" ? complishment : null}</p>
				{complishment === "NGU" && !isCorrect ?
					< video src="video.mp4" width="50%" autoPlay controls onEnded={() => setIsCorrect(() => true)} ></video>
					: null}
			</div>
		</div>
	);
}

export default App;
