<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:nxl="http://mutan8.exout.net/">
<!--
<xsl:output method="text" />
-->
<xsl:template match="nxl:assign"><xsl:value-of select="@select" />&#0032;=&#0032;<xsl:apply-templates />;</xsl:template>

<xsl:template name="operator">
	<xsl:if test="position()&gt;1">
		<xsl:choose>
			<xsl:when test="../@method='add'"> + </xsl:when>
			<xsl:when test="../@method='diff'"> - </xsl:when>
			<xsl:when test="../@method='multi'"> * </xsl:when>
			<xsl:when test="../@method='div'"> / </xsl:when>
			<xsl:when test="../@method='mod'"> % </xsl:when>
			<xsl:when test="../@method='pow'"> ^ </xsl:when>
			<xsl:otherwise> </xsl:otherwise>
		</xsl:choose>
	</xsl:if>
</xsl:template>

<xsl:template match="nxl:calc"><xsl:call-template name="operator" />(<xsl:apply-templates />)</xsl:template>

<xsl:template match="nxl:value">
	<xsl:call-template name="operator" />
		<xsl:choose>
			<xsl:when test="boolean(@value)"><xsl:value-of select="@value" /></xsl:when>
			<xsl:otherwise><xsl:value-of select="self::nxl:value" /></xsl:otherwise>
		</xsl:choose>
</xsl:template>

</xsl:stylesheet>