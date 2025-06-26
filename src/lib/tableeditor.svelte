<svelte:options customElement={{tag: 'table-editor'}} />

<script>
	import { onMount } from 'svelte';

	let dataHead = $state([]); // headers for each column
	let dataBody = $state([]); // columns and rows itself
	const {src, saveFunction} = $props();

	onMount(() => {
		loadJsonFile(src);
	});

	async function loadJsonFile(path)
	{
		const response = await fetch(path);
		var data = await response.json();

		dataHead = Object.keys(data[0]);
		dataBody = data;
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

	function addRow()
	{
		const keys = (dataHead ?? {});

		const newRow = keys.reduce((obj, key) => ({ ...obj, [key]: '' }), {});

		dataBody = [...dataBody, newRow];
	}

	function addColumn()
	{
		const newKey = makeid(5);

		const updatedDataBody = dataBody.map((entry, index) => ({
			...entry,
			[newKey]: "",
		}));

		dataBody = updatedDataBody;
		dataHead = [...dataHead, newKey]
	}

	function deleteRow(id)
	{
		dataBody = dataBody.filter((_, i) => i !== id);
	}

	function deleteColumn(id)
	{
		const keyToRemove = dataHead[id];

		dataBody = dataBody.map(({ [keyToRemove]: _, ...rest }) => rest);
		dataHead = dataHead.filter(item => item !== keyToRemove);
	}

	function moveRow(id, amount)
	{
		dataBody.splice(id + amount, 0, dataBody.splice(id, 1)[0]);
		dataBody = dataBody;
	}

	function moveColumn(id, amount)
	{
		[dataHead[id], dataHead[id + amount]] = [dataHead[id + amount], dataHead[id]];
	}

	function saveJsonFile()
	{
		const jsonStr = JSON.stringify(dataBody, null, 2);
		saveFunction(jsonStr);
	}
</script>


<svelte:head>
	<title> JSON editor </title>
</svelte:head>


<h1> JFON table ediwtorw </h1>
<br>
{#if dataBody.length && dataHead.length}
<table>
	<thead>
		<tr>
			{#each dataHead as key, i}
			<th> <div>
				{#if i !== 0}
				<button class="clickable unmarkable" aria-label="move Column left" onclick={() => moveColumn(i, -1)}> ← </button>
				{:else}
				<p class="unmarkable" style="color: #aaa"> ← </p>
				{/if}

				{#if i !== dataHead.length - 1}
				<button class="clickable unmarkable" aria-label="move Column right" onclick={() => moveColumn(i, 1)}> → </button>
				{:else}
				<p class="unmarkable" style="color: #aaa"> → </p>
				{/if}
			</div> </th>
			{/each}
		</tr>

		<tr>
			{#each dataHead as key, i}
			<th class="th"> <div> <input type="text" bind:value={dataHead[i]}>
				<button aria-label="delete this Column" onclick={() => deleteColumn(i)}> - </button>
			</th>
			{/each}
			<th class="clickable unmarkable" aria-label="add new Column" onclick={addColumn}> + </th>
		</tr>
	</thead>

	<tbody>
		{#each dataBody as row, i}
		<tr>
			{#each dataHead as key}
			<td class="td"> <input type="text" bind:value={dataBody[i][key]} /> </td>
			{/each}

			<td class="clickable unmarkable" aria-label="delete this Row" onclick={() => deleteRow(i)}> - </td>

			{#if i !== 0}
			<td class="clickable unmarkable arrowUp" aria-label="move Row up" onclick={() => moveRow(i, -1)}> ↑ </td>
			{:else}
			<td class="arrowUp unmarkable" style="color: #aaa"> ↑ </td>
			{/if}

			{#if i !== dataBody.length - 1}
			<td class="clickable unmarkable arrowDown" aria-label="move Row down" onclick={() => moveRow(i, 1)}> ↓ </td>
			{:else}
			<td class="arrowDown unmarkable" style="color: #aaa"> ↓ </td>
			{/if}
		</tr>
		{/each}

		<tr>
			<td colspan={dataHead.length + 1}
				class="clickable unmarkable"
				style="text-align:center"
				aria-label="add new Row"
				onclick={addRow}> + new line
			</td>

			<td colspan=2
				class="clickable unmarkable"
				style="text-align:center"
				aria-label="save json file"
				onclick={saveJsonFile}> save
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
