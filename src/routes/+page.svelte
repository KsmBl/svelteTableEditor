<script>
	import { onMount } from 'svelte';

	let data = [];
	let tableObject;

	onMount(() => {
		loadJsonFile('/sample.json');
	});

	async function loadJsonFile(path)
	{
		const response = await fetch(path);
		//TODO
		data = await response.json();
	}
	
	function makeid(length)
	{
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var charactersLength = characters.length;

		for(var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	function updateData()
	{
		//get all headers and datas
		const ths = tableObject.getElementsByClassName("th");
		const tds = tableObject.getElementsByClassName("td");

		//calculate width and height of table
		const width = ths.length;
		const height = tds.length / width;

		//create Array for all parsed data
		let newData = [];

		//run for each row of tabledatas
		for(var i = 0; i < height; i++) {
			//create a row object for newData[]
			let row = {};
			
			//run for each column in the current row
			for(var ii = 0; ii < width; ii++) {
				//parse the key for this field
				const key = ths[ii].querySelector("input").value.trim();

				//parse the value for this field
				const input = tds[ii + (i * width)].querySelector("input");
				const value = input.value.trim();

				//add key-value pear to this row in saved data
				row[key] = value;
			}

			//save parsed row in newData[]
			newData.push(row);
		}

		//replace old data with new parsed Data
		//TODO
		data = newData;
	}

	function addRow()
	{
		//TODO
		const keys = Object.keys(data[0] ?? {});

		const newRow = keys.reduce((obj, key) => ({ ...obj, [key]: '' }), {});

		//TODO
		data = [...data, newRow];
	}

	function addColumn()
	{
		const newKey = makeid(5);
		//TODO
		const updated = data.map(row => ({ ...row, [newKey]: '' }));

		//TODO
		data = updated;
	}

	function deleteRow(id)
	{
		updateData();
		//TODO
		data = data.filter((_, i) => i !== id);
	}

	function deleteColumn(id)
	{
		updateData();
		//TODO
		const keyToRemove = Object.keys(data[0])[id];
		//TODO
		const trimmed = data.map(({ [keyToRemove]: _, ...rest }) => rest);

		//TODO
		data = trimmed;
	}

	function moveRowup(id)
	{
		updateData();

		//TODO
		if (id - 1 >= data.length) {
			//TODO
			var k = id - 1 - data.length + 1;
			while (k--) {
				//TODO
				data.push(undefined);
			}
		}

		//TODO
		data.splice(id - 1, 0, data.splice(id, 1)[0]);
	}

	function moveRowdown(id)
	{
		updateData();

		//TODO
		if(id + 1 >= data.length) {
			var k = id + 1 - data.length + 1;
			while(k--) {
				//TODO
				data.push(undefined);
			}
		}

		//TODO
		data.splice(id + 1, 0, data.splice(id, 1)[0]);
	}

	function moveColumn(id, amount)
	{
		//get all table headers and datas
		const ths = tableObject.getElementsByClassName("th");
		const tds = tableObject.getElementsByClassName("td");

		//calculate width and height of table
		const width = ths.length;
		const height = tds.length / width;

		for(var i = 0; i < height; i++) {
			//TODO
			const keys = Object.keys(data[i]);

			const firstKey = keys[id - 1 + amount];
			const secondKey = keys[id + amount];
			//TODO
			const temp = data[i][firstKey];
			data[i][firstKey] = data[i][secondKey];
			data[i][secondKey] = temp;

			const newObj = {};

			for(var ii = 0; ii < keys.length; ii++) {
				const key = keys[ii];

				if (ii === id - 1 + amount) {
					//TODO
					newObj[secondKey] = data[i][firstKey];
				} else if (ii === id + amount) {
					//TODO
					newObj[firstKey] = data[i][secondKey];
				} else {
					//TODO
					newObj[key] = data[i][key];
				}
			}

			//TODO
			data[i] = newObj;
		}
	}

	function saveJsonFile()
	{
		updateData();

		//TODO
		const jsonStr = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = "test.json";
		link.click();

		URL.revokeObjectURL(url);
	}
</script>


<svelte:head>
	<title> JSON editor </title>
</svelte:head>


<h1> JFON table ediwtorw </h1>
<br>

{#if data.length}
<table bind:this={tableObject}>
	<thead>
		<tr>
			{#each Object.keys(data[0]) as key, i}
			<th> <div>
				{#if i !== 0}
				<button class="clickable unmarkable" aria-label="move Column left" on:click={() => moveColumn(i, 0)}> ← </button>
				{:else}
				<p class="unmarkable" style="color: #aaa"> ← </p>
				{/if}

				{#if i !== Object.keys(data[0]).length - 1}
				<button class="clickable unmarkable" aria-label="move Column right" on:click={() => moveColumn(i, 1)}> → </button>
				{:else}
				<p class="unmarkable" style="color: #aaa"> → </p>
				{/if}
			</div> </th>
			{/each}
		</tr>

		<tr>

			{#each Object.keys(data[0]) as key, i}
			<th class="th"> <div> <input type="text" value={key}>
				<button aria-label="delete this Column" on:click={() => deleteColumn(i)}> - </button>
			</th>
			{/each}
			<th class="clickable unmarkable" aria-label="add new Column" on:click={addColumn}> + </th>
		</tr>
	</thead>

	<tbody>
		{#each data as row, i}
		<tr>
			{#each Object.keys(row) as key}
			<td class="td"> <input type="text" bind:value={data[i][key]} /> </td>
			{/each}

			<td class="clickable unmarkable" aria-label="delete this Row" on:click={() => deleteRow(i)}> - </td>

			{#if i !== 0}
			<td class="clickable unmarkable arrowUp" aria-label="move Row up" on:click={() => moveRowup(i)}> ↑ </td>
			{:else}
			<td class="arrowUp unmarkable" style="color: #aaa"> ↑ </td>
			{/if}

			{#if i !== data.length - 1}
			<td class="clickable unmarkable arrowDown" aria-label="move Row down" on:click={() => moveRowdown(i)}> ↓ </td>
			{:else}
			<td class="arrowDown unmarkable" style="color: #aaa"> ↓ </td>
			{/if}
		</tr>
		{/each}

		<tr>
			<td colspan={Object.keys(data[0]).length + 1}
				class="clickable unmarkable"
				style="text-align:center"
				aria-label="add new Row"
				on:click={addRow}> + new line
			</td>

			<td colspan=2
				class="clickable unmarkable"
				style="text-align:center"
				aria-label="save json file"
				on:click={saveJsonFile}> save
			</td>
		</tr>
	</tbody>
</table>
{/if}

<style>
	* {
		padding: 0px;
		margin: 0px;
	}

	h1 {
		padding: 10px 0px 10px 0px;
	}

	table {
		border-collapse: collapse;
	}

	th, td {
		text-align: left;
		border: 1px solid #cccccc;
		padding: 2px;
		max-width: 300px;
	}

	th div {
		display: flex;

		input {
			max-width: 170px;
		}

		button {
			width: 15px;
			background-color: #00000000;
			border: none;
			cursor: pointer;
		}

		p, button {
			width: 50%;
			text-align: center;
		}
	}

	thead {
		border-bottom: 2px solid #666;
	}

	input {
		border: none;
	}

	.clickable {
		cursor: pointer;
	}

	.unmarkable {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
