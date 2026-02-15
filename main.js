
let slideshowTimer
let deleteFirstSlideDelay

async function startApplication() {
	try {
		const response = await fetch('https://dog.ceo/api/breeds/list/all')
		const breedData = await response.json()
		createBreedList(breedData.message)
	} catch (error) {
		console.error('There was a problem fetching the breed list.')
	}
}

startApplication()

function createBreedList(breedList) {
	document.getElementById('breed').innerHTML = `
		<select onchange='loadByBreed(this.value)'>
			<option>Choose a dog breed</option>
			${Object.keys(breedList)
				.map(function (breed) {
					return `<option>${breed}</option>`
				})
				.join('')}
		</select>
	`
}

async function loadByBreed(breed) {
	if (breed !== 'Choose a dog breed') {
		try {
			const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`)
			const imageData = await response.json()
			createSlideshow(imageData.message)
		} catch (error) {
			console.error('There was a problem fetching images for the selected breed.')
		}
	}
}

function createSlideshow(images) {
	let currentPosition = 0

	clearInterval(slideshowTimer)
	clearTimeout(deleteFirstSlideDelay)

	if (images.length > 1) {
		document.getElementById('slideshow').innerHTML = `
			<div class='slide' style='background-image: url("${images[0]}")'></div>
			<div class='slide' style='background-image: url("${images[1]}")'></div>
		`
		currentPosition = 2
		slideshowTimer = setInterval(showNextSlide, 3000)
	} else {
		document.getElementById('slideshow').innerHTML = `
			<div class='slide' style='background-image: url("${images[0]}")'></div>
			<div class='slide'></div>
		`
	}

	function showNextSlide() {
		document
			.getElementById('slideshow')
			.insertAdjacentHTML(
				'beforeend',
				`<div class='slide' style='background-image: url("${images[currentPosition]}")'></div>`
			)

		deleteFirstSlideDelay = setTimeout(function () {
			const firstSlide = document.querySelector('.slide')
			if (firstSlide) {
				firstSlide.remove()
			}
		}, 1000)

		if (currentPosition + 1 >= images.length) {
			currentPosition = 0
		} else {
			currentPosition++
		}
	}
}
