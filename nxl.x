<?xml version="1.0" encoding="utf-8" ?>
<nxl:processing xmlns:nxl="http://mutan8.exout.net/" parser="JScript">
	<nxl:var name="s" value="1" />
	<nxl:var name="i" value="1" />

	<nxl:while test="$i &lt;= 100">
		<nxl:calc type="div" value="$i $s" return="$s" />
		<nxl:calc type="add" value="$i 1" return="$i" />
	</nxl:while>

	<nxl:echo>
		計算の結果、"{$s}"という値がでました！
	</nxl:echo>

</nxl:processing>