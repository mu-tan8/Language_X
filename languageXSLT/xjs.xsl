<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:nxl="http://mutan8.exout.net/">

<xsl:output method="html" />

<xsl:template match="/">
	<script type="text/javascript">
<![CDATA[<!--]]>
	str = &quot;<xsl:apply-templates />&quot;;
	alert(eval(str));
	document.writeln(str);
<![CDATA[//-->]]></script>
</xsl:template>

<xsl:include href="xstate.xsl" />

</xsl:stylesheet>