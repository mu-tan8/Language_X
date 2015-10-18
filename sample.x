<?xml version="1.0" encoding="utf-8" ?>
<nxl:processing xmlns:nxl="http://mutan8.exout.net/" parser="JScript">
	<nxl:var type="int" name="n" />
	<nxl:var type="dbl" name="p" value="3.2" />
	<nxl:var type="ary" name="a" value="bool:0 str:NaN int:9" />

	<nxl:echo>{$a[str]}</nxl:echo>

	<nxl:calc type="add" value="1 3 5 7 9 11 $p" return="$n" />

	<nxl:echo>
		計算の結果、"{$n}"という値がでました！
	</nxl:echo>

</nxl:processing>